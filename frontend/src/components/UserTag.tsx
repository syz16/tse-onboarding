import React from "react";
import styles from "src/components/UserTag.module.css";
import type { User } from "src/api/users";

export interface UserItemProps {
  user: User | null | undefined;
}

export function UserTag({ user: user }: UserItemProps) {
  if (user == undefined || user == null) {
    return (
      <div className={styles.wrapper}>
        <span className={styles.body}>Not assigned</span>
      </div>
    );
  } else {
    return user.profilePictureURL == undefined || user.profilePictureURL == "" ? (
      <div className={styles.wrapper}>
        <img
          src="/userDefault.svg"
          alt="profile picture"
          width={32}
          height={32}
          className={styles.profilePic}
        />
        <span className={styles.body}>{user.name}</span>
      </div>
    ) : (
      <div className={styles.wrapper}>
        <img
          src={user.profilePictureURL}
          alt="profile picture"
          width={32}
          height={32}
          className={styles.profilePic}
        />
        <span className={styles.body}>{user.name}</span>
      </div>
    );
  }
}
