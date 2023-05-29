import styles from "@/src/pages/lobby/page.module.css";

interface ChatMessageProps {
  message: string | null;
  type: string;
  username: string | null;
}

export default function ChatMessage(props: ChatMessageProps) {
  if (props.type == "system") {
    return (
      <p className={`${styles.systemMessage} ${styles.fadeIn}`}>
        {props.message}
      </p>
    );
  } else {
    return (
      <p className={`${styles.fadeIn}`}>
        <b>{props.username}</b>
        <span>: {props.message}</span>
      </p>
    );
  }
}
