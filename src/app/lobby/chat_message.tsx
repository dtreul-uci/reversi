import styles from "./page.module.css";

interface ChatMessageProps {
  message: string | null;
  type: string;
  username: string | null;
}

export default function ChatMessage(props: ChatMessageProps) {
  if (props.type == "system") {
    return <p className={styles.systemMessage}>{props.message}</p>;
  } else {
    return (
      <p className={styles.chatMessage}>
        <b>{props.username}</b>
        <span>: {props.message}</span>
      </p>
    );
  }
}
