import "./PostStatus.css";
import { useRef, useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import { PostStatusPresenter, PostStatusView } from "../../presenter/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";

interface Props {
  presenterFactory: (view: PostStatusView) => PostStatusPresenter
}

const PostStatus = (props: Props) => {
  const { displayInfoMessage, displayErrorMessage, deleteMessage } = useMessageActions();
  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listener: PostStatusView = {
    displayInfoMessage: displayInfoMessage,
    deleteMessage: deleteMessage,
    setIsLoading: setIsLoading,
    setPost: setPost,
    displayErrorMessage: displayErrorMessage
  }

  const presenterRef = useRef<PostStatusPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener)
  }

  const checkButtonStatusDisabled = (post: string, authToken: AuthToken, currentUser: User): boolean => {
    return !post.trim() || !authToken || !currentUser;
  };

  const submitPost = (event: React.MouseEvent) => {
    event.preventDefault();
    presenterRef.current!.submitPost(post, authToken!, currentUser!)
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    presenterRef.current!.clearPost()
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          aria-label="status-text"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonStatusDisabled(post, authToken!, currentUser!)}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatusDisabled(post, authToken!, currentUser!)}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
