import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import SimplePeer from 'simple-peer';

import { io } from 'socket.io-client'
import { UserService } from '../../services/user.service';
import { LiveService } from '../../services/live.service';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { v4 as uuidv4 } from 'uuid'; // Assuming you're using 'uuid' for generating unique room IDs
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-live-stream',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, SidepanelComponent],
  templateUrl: './live-stream.component.html',
  styleUrl: './live-stream.component.css'
})
export class LiveStreamComponent implements OnInit {

  isChatVisible: boolean = true; // Initially visible

  private socket: any;
  private localStream: MediaStream | null = null;
  private peerConnections: { [key: string]: SimplePeer.Instance } = {};
  private videoTrack: MediaStreamTrack | null = null;
  private audioTrack: MediaStreamTrack | null = null;
  userId: string = '';
  roomerId: string = ''

  title: string | undefined;
  description: string | undefined;
  imageUrl: string | undefined;
  private mediaStream!: MediaStream;
  private mediaRecoder!: MediaRecorder
  private recordedChunks: Blob[] = []
  isAudioEnabled = true;
  isVideoEnabled = true;
  isStreaming = false;

  // Define BehaviorSubject to hold stream data
  private streamDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  streamData$ = this.streamDataSubject.asObservable();


  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  messages: { user: string; text: string }[] = [];
  messageInput: string = '';


  constructor(private _userService: UserService, private _liveservice: LiveService) {
    // this.socket = io('http://localhost:5005');

    // this.socket = io('https://streamiobackend.ddns.net/live-service');


    this.socket = io('wss://streamiobackend.ddns.net', {
      path: '/live-service/socket.io', // Explicitly set the custom path
      transports: ['websocket', 'polling'], // Ensure compatibility with the server
      withCredentials: true, // Allow cross-origin cookies and credentials
    });
    

  }



  ngOnInit(): void {
    this._liveservice.formData$.subscribe((data) => {
      if (data) {

        this.title = data.title
        this.description = data.description
        this.imageUrl = data.imageurl
      }

      console.log("data @ livestream", data)
    })


    this._userService.getUserProfile().subscribe((res) => {
      console.log("userprofile", res.userProfile._id)
      this.userId = res.userProfile.name
    })

    this.initializeMediaStream()
    this.handleSocketEvents();


    this.socket.on('chat-message', (message: { user: string; text: string }) => {
      // Check if the message is sent by the current user
      if (message.user !== this.userId) {
        this.messages.push(message);
      }
    });

  }





  sendMessage() {
    if (this.messageInput.trim() !== '') {
      // Emit the message to the server
      this.socket.emit('chat-message', {
        roomId: this.roomerId,
        user: this.userId,
        text: this.messageInput,
      });

      // Add the message locally for immediate feedback
      this.messages.push({
        user: 'You',
        text: this.messageInput,
      });

      // Clear the input field
      this.messageInput = '';
    }
  }





  async initializeMediaStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.videoElement.nativeElement.srcObject = this.localStream;
      this.videoElement.nativeElement.muted = true;
      this.videoElement.nativeElement.play();


      this.setupMediaRecorder()

      const streamData = {
        userId: this.userId,
        title: this.title,
        description: this.description,
        stream: this.localStream,
        isStreaming: this.isStreaming
      }
      this.streamDataSubject.next(streamData);


    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  }


  setupMediaRecorder() {

    if (this.localStream) {
      this.mediaRecoder = new MediaRecorder(this.localStream)
      console.log('MediaRecorder setup complete:', this.mediaRecoder);

      this.mediaRecoder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data)
        }
      }
      this.mediaRecoder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' })
        // this.downloadRecording(blob);
        this.recordedChunks = []; // Clear the recorded chunks

      }

    }
  }





  createPeerConnection(peerId: string, initiator: boolean) {
    const peer = new SimplePeer({
      initiator,
      trickle: false,
      stream: this.localStream!,  // Send the local stream to the viewer
    });

    peer.on('signal', (signalData) => {
      this.socket.emit('signal', {
        roomId: this.roomerId,
        signalData,
        fromPeerId: this.userId,
        toPeerId: peerId,
      });
    });

    peer.on('connect', () => {
      console.log('Connected to peer', peerId);
    });

    this.peerConnections[peerId] = peer;
  }

  handleSocketEvents() {
    // When a new viewer joins, create a peer connection and send stream
    this.socket.on('new-viewer', (viewerId: string) => {
      console.log('New viewer joined:', viewerId);

      this.createPeerConnection(viewerId, true);
    });

    // Handle incoming signals
    this.socket.on('signal', ({ signalData, fromPeerId }: { signalData: any; fromPeerId: string }) => {
      if (this.peerConnections[fromPeerId]) {
        this.peerConnections[fromPeerId].signal(signalData);
      }
    });


  }

  toggleAudio() {
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks();
      audioTracks.forEach(track => (track.enabled = !track.enabled));
      this.isAudioEnabled = !this.isAudioEnabled;
    }
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      videoTracks.forEach(track => (track.enabled = !track.enabled));
      this.isVideoEnabled = !this.isVideoEnabled;
    }
  }


  startStreaming() {
    // Show confirmation before starting the streaming
    Swal.fire({
      title: 'Start Streaming?',
      text: "Do you want to start the stream?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Start',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isStreaming = true;
        console.log('Streaming started');
        // Add any additional logic to start the streaming here
        Swal.fire('Streaming Started!', 'Your live streaming has started.', 'success');

        const rooId = uuidv4()
        const streamData = {
          roomId: rooId,
          title: this.title,
          description: this.description,
          imageurl: this.imageUrl,
          streamerId: this.userId,
          stream: this.localStream,
          isStreaming: this.isStreaming
        }


        // Saving data to BehaviorSubject
        this.streamDataSubject.next(streamData)


        this._liveservice.saveLiveDetails(streamData).subscribe((res) => {
          console.log("Live data saved successfully", res)
        })

        this.roomerId = rooId



        this.socket.emit('start-streaming', rooId, this.userId)

        // this.startRecording()


      }
    });
    // this.startRecording()

  }

  stopStreaming() {

    Swal.fire({
      title: 'Stop Streaming?',
      text: "Do you want to stop the stream?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Stop',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isStreaming = false;
        console.log('Streaming stopped');


        this.streamDataSubject.next(null)
        this._liveservice.deleteLiveDetails(this.roomerId).subscribe((res) => {
          console.log("stream data deleted successfully")
        })


        if (this.localStream) {
          this.localStream.getTracks().forEach(track => track.stop());
          this.localStream = null
        }


        // Remove all peer connections
        for (const peerId in this.peerConnections) {
          if (this.peerConnections.hasOwnProperty(peerId)) {
            this.peerConnections[peerId].destroy();
          }
        }
        this.peerConnections = {};

        Swal.fire('Streaming Stopped', 'Your live streaming has stopped.', 'info');


      }
    });
  }






}
