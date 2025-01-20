import styles from "@/components/widget/Widget.module.css";
import { ReactNode } from "react";

interface PropsType {
  title: string;
  children: ReactNode;
}

export default function Widget({ title, children }: PropsType) {
  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        {/* 헤더 */}
        <div className={styles.headerContainer}>
          <p>{title}</p>
        </div>
        {/* 컨텐츠 컴포넌트 */}
        <div className={styles.contentsContainer}>{children}</div>
      </div>
    </div>
  );
}
