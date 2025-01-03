import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import SimplePeer from 'simple-peer';
import { LiveService } from '../../services/live.service';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-live-viewer',
  standalone: true,
  imports: [HeaderComponent, SidepanelComponent, CommonModule, FormsModule],
  templateUrl: './live-viewer.component.html',
  styleUrl: './live-viewer.component.css'
})
export class LiveViewerComponent implements OnInit ,AfterViewInit{




  private socket: any;
  private peerConnection: SimplePeer.Instance | null = null;
  private userId: string = '';
  roomId: string = '';
  viewerCount: number = 0;

  private peerConnections: { [key: string]: RTCPeerConnection } = {};

  messages: { user: string; text: string }[] = [];
  messageInput: string = '';




  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  constructor(private _userService: UserService, private _route: ActivatedRoute, private _liveservice: LiveService) {
   


    this.socket = io('wss://streamiobackend.ddns.net', {
      path: '/socket.io',  // This should match the path in both API Gateway and backend
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      console.log('Socket ID:', this.socket.id);  // Log the socket ID

    });
  }




  ngOnInit(): void {
    this._userService.getUserProfile().subscribe((res) => {
      console.log('User profile response:', res);

      this.userId = res.userProfile.name;

      this._route.params.subscribe(params => {
        this.roomId = params['roomid'];
        this.socket.emit('join-stream', this.roomId, this.userId);



        this._liveservice.streamData$.subscribe((streamData: any) => {
          // if(streamData && streamData.roomId===this.roomId){
          console.log("received stream data : ", streamData)
          this.startReceivingStream()
          // }
        })


        this.socket.on('signal', ({ signalData, fromPeerId }: { signalData: any; fromPeerId: string }) => {
          if (this.peerConnection) {
            this.peerConnection.signal(signalData);
          }
        });


        this.socket.on('stream-start', (streamData: any) => {
          console.log("streamData", streamData)
          this.startReceivingStream();
        });


        this.socket.on('chat-message', (message: { user: string; text: string }) => {
          // Checking if the message is sent by the current user
          if (message.user !== this.userId) {
            this.messages.push(message);
          }
        });



      });
    });
  }



  sendMessage() {
    if (this.messageInput.trim() !== '') {
      // Emit the message to the server
      this.socket.emit('chat-message', {
        roomId: this.roomId,   
        user: this.userId,
        text: this.messageInput,
      });
  
      this.messages.push({
        user: 'You',
        text: this.messageInput,
      });
  
      this.messageInput = '';
    }
  }
  





  startReceivingStream() {
    this.peerConnection = new SimplePeer({
      initiator: false,
      trickle: false,
    });

    // Handle signaling data generated by this peer
    this.peerConnection.on('signal', (signalData) => {
      this.socket.emit('signal', {
        roomId: this.roomId,
        signalData,
        fromPeerId: this.userId,
        toPeerId: 'streamer-id-placeholder', // Replace with actual streamer ID if available
      });
    });

    // Handle incoming media stream
    this.peerConnection.on('stream', (stream: MediaStream) => {
      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.play();
    });





    // this.socket.emit('join-stream', this.roomId, this.userId);


  }

  ngAfterViewInit(): void {
    this.videoElement.nativeElement.style.visibility = 'visible';
  }
  


}
