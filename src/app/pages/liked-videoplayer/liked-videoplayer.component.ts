import { Component, ElementRef, ViewChild } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Picker } from 'emoji-picker-element';
import { IvideoDocument } from '../user-home/home.component';
import videojs from 'video.js'; // Import video.js
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RelativetimePipe } from '../../shared/pipes/relativetime.pipe';


interface Reply {
  userId: string;
  content: string;
  createdAt: string;
}


interface Comment {
  id: string;
  content: string;
  replies: Reply[]; // Add replies as an array of Reply objects
  showReplies?: boolean;  // optional property to toggle replies visibility

}

@Component({
  selector: 'app-liked-videoplayer',
  standalone: true,
  imports: [HeaderComponent, FormsModule, CommonModule, ReactiveFormsModule, RelativetimePipe],
  templateUrl: './liked-videoplayer.component.html',
  styleUrl: './liked-videoplayer.component.css'
})
export class LikedVideoplayerComponent {
  showReplyInput: boolean = false;
  replyText: string = '';
  replyInputVisibility: { [key: string]: boolean } = {};
  otherVideos: IvideoDocument[] = [];
  private socket: any;

  likedVideos :any= [];

  @ViewChild('emojiDiv')
  private emojiDiv!: ElementRef<HTMLDivElement>;

  private emojiPicker: Picker;
  showEmojiPicker: boolean = false;
  isLiked = false; // Tracks the like/dislike state

  private _videoLink = "";
  private player: any;

  title!: string
  description!: string

  commentForm!: FormGroup;

  comments: Comment[] = []; // Correctly typed as an array of objects
  vvid!: string

  channelName!: string
  subscribed!: string | boolean;

  constructor(private _videoservice: VideoService, private _route: ActivatedRoute, private fb: FormBuilder, private http: HttpClient, private _router: Router) {
    this.emojiPicker = new Picker();

    // Listen to route changes to get the videoId
    this._route.params.subscribe(params => {
      const videoId = params['id'];
      console.log("Video ID:", videoId);
      this.vvid = videoId
      this.fetchVideo(videoId);
    });

    this.commentForm = this.fb.group({
      comment: ['', [Validators.required]]

    })

  }

  linkkk = '';


  private fetchVideo(videoId: string) {

    // this._videoservice.getlikedvideos().subscribe((res)=>{
    //   console.log("res @likedplayerr",res)
    // })

    this._videoservice.getIndividualVideos(videoId).subscribe((res: any) => {
      console.log('Response:', res);
      this.title = res._doc.title
      this.description = res._doc.description
      console.log('Video link:', res.videolink);
      this.linkkk = res._doc.videolink;
      this.comments = res.comments
      this.channelName = res.uploader.name
      this.subscribed = res.subscribed

      this.isLiked = res.isLiked
      console.log("comments are ", this.comments)
      this.videoLink = `https://d3qrczdrpptz8b.cloudfront.net/${this.linkkk}`;
    });

  }

  // Set the video link and initialize the player
  set videoLink(value: string) {
    this._videoLink = value;
    if (this.player) {
      this.player.src({
        src: this._videoLink,
        type: 'application/x-mpegURL',
        withCredentials: true
      });
    } else if (this._videoLink) {
      this.initializePlayer();
    }
  }



  // Initializing  the video player
  private initializePlayer(): void {
    if (this.player) {
      console.log("Player already initialized.");
      return;
    }

    // Directly query the video element by its id
    const videoElement = document.getElementById('video-player') as HTMLVideoElement;
    if (videoElement) {
      this.player = videojs(videoElement, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        fluid: true,
        sources: [
          {
            src: this._videoLink,
            type: 'application/x-mpegURL'
          }
        ]
      });



      // Error handling
      this.player.on('error', () => {
        console.error('Error loading video.');
      });
    }
  }


  ngAfterViewInit(): void {
    // Append the emoji picker to the emojiDiv element
    this.emojiDiv.nativeElement.appendChild(this.emojiPicker);

    // Listen for emoji selection
    this.emojiPicker.addEventListener('emoji-click', (event: any) => {
      const emoji = event.detail.unicode;
      const commentControl = this.commentForm.get('comment');
      const currentValue = commentControl?.value || '';
      commentControl?.setValue(currentValue + emoji);
    });

    this.incrementViews()

    this.fetchLikedVideos()

  }

  incrementViews() {

    this._videoservice.incrementviews(this.vvid).subscribe((res) => {
      console.log("view added", res)
    })
  }



  // Submit the comment
  submitComment(): void {
    if (this.commentForm.valid) {
      const commentData = { comment: this.commentForm.value.comment, videoId: this.vvid };

      this.postComment(commentData).subscribe(
        (response: any) => {
          console.log('Comment posted:', response);

          // Create a structured comment object
          const newComment = {
            id: response.id, // Assuming the API returns the comment ID
            content: response.comment || this.commentForm.value.comment, // Use response data or fallback to form data
            replies: [] // Initialize with an empty replies array
          };

          // Add the new comment to the top of the comments array
          this.comments.unshift(newComment);

          // Reset the form
          this.commentForm.reset();
        },
        (error: any) => {
          console.error('Error posting comment:', error);
        }
      );
    }
  }




  postComment(commentData: { comment: string, videoId: string }): Observable<any> {
    const apiUrl = 'https://streamiobackend.ddns.net/comment-service/comments';
    return this.http.post<any>(apiUrl, commentData);
  }


  // Toggle the visibility of the reply input for a specific comment
  toggleReplyInput(commentId: string) {
    console.log("@input clicker")
    this.replyInputVisibility[commentId] = !this.replyInputVisibility[commentId];
  }

  // Check if the reply input for a specific comment is visible
  isReplyInputVisible(commentId: string): boolean {
    return this.replyInputVisibility[commentId];
  }

  // Send the reply
  sendReply(commentId: string) {
    if (this.replyText.trim()) {
      console.log('Reply:', this.replyText);
      console.log('Comment Id:', commentId);

      const commentdata = {
        cId: commentId,
        reply: this.replyText,
      };

      this._videoservice.replyComment(commentdata).subscribe(
        (res: any) => {
          console.log('Reply posted successfully:', res);

          // Find the comment in the comments array
          const comment = this.comments.find(c => c.id === commentId);
          console.log('Found comment:', comment); // Log the found comment

          if (comment) {
            console.log('Comment inside if condition:', comment);

            // Ensure replies array exists
            if (!comment.replies) {
              comment.replies = [];
            }

            // Add the new reply to the comment's replies array
            comment.replies.push({
              content: this.replyText,
              userId: res.userId || 'currentUser', // Use currentUser if backend doesn't return userId
              createdAt: new Date().toISOString(), // Use current time or one from backend
            });

            console.log('Updated replies:', comment.replies);
          } else {
            console.warn(`Comment with ID ${commentId} not found!`);
          }

          // Clear the reply input field
          this.replyText = '';
        },
        (err) => {
          console.error('Failed to post reply:', err);
        }
      );
    }
  }


  toggleRepliesVisibility(commentId: string): void {
    const comment = this.comments.find(c => c.id === commentId);
    console.log("@showre", comment)
    if (comment) {
      comment.showReplies = !comment.showReplies;
    }
  }


  showComments = true; // Set the default to show comments

  toggleCommentSection() {
    this.showComments = !this.showComments;
  }



  // Show or hide the emoji picker
  showOrCloseEmojiPicker(): void {
    console.log("clicked@emjo")
    this.showEmojiPicker = !this.showEmojiPicker;
  }



  toggleHeart(videoid: string) {
    if (this.isLiked) {
      this.unlike(videoid); // Call unlike method if already liked
    } else {
      this.like(videoid); // Call like method if not liked
    }
    this.isLiked = !this.isLiked; // Toggle the like status
  }



  like(videoid: string) {
    console.log('You liked the post!', videoid);
    // Add your logic here, e.g., send like data to an API
    this._videoservice.likeVideo(videoid).subscribe((res) => {
      console.log("response of liked video", res)
    })
  }

  unlike(videoid: string) {
    console.log('You unliked the post!', videoid);

    this._videoservice.unlikeVideo(videoid).subscribe((res) => {
      console.log("res @unlike", res)
    })

    // Add your logic here, e.g., send unlike data to an API
  }


  // Report video action
  reportVideo() {
    alert('This video has been reported.');
  }




  fetchLikedVideos() {
    this._videoservice.getlikedvideos().subscribe((res: any) => {
      console.log("liked videos are ", res)
      this.likedVideos = res.videos
    })
  }





  
  onMovieClick(movieId: string): void {
    console.log("videoid @ onclicik",movieId)
    const url = `https://streamio-frontend-kzuy.vercel.app/likedvideo/${movieId}`; // Construct the full URL
    console.log("Navigating to URL:", url);
    window.location.href = url; // Navigate to the constructed URL
  }


}
