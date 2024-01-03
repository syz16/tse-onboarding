import React, { useEffect, useState } from "react";
import { getTask, type Task } from "src/api/tasks";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Button, Page } from "src/components";
import styles from "src/pages/TaskDetail.module.css";

export function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState<Task>();

  useEffect(() => {
    getTask(id as string).then((result) => {
      if (result.success) {
        setTask(result.data);
      }
    });
  }, []);

  if (task == undefined) {
    return (
      <Page>
        <Helmet>
          <title>Task Not Found | TSE Todos</title>
        </Helmet>
        <p>
          <Link to="/">Back to home</Link>
        </p>
        <div className={styles.wrapper}>
          <div className={styles.title}>This task doesn&rsquo;t exist!</div>
        </div>
      </Page>
    );
  } else {
    return (
      <Page>
        <Helmet>
          <title>{task.title && `${task.title} | TSE Todos`}</title>
        </Helmet>
        <p>
          <Link to="/">Back to home</Link>
        </p>
        <div className={styles.wrapper}>
          <div className={styles.titleRowWrapper}>
            <div className={styles.title}>{task.title}</div>
            <Button kind="primary" type="button" label="Edit task" className={styles.editButton} />
          </div>
          {task.description ? (
            <div className={styles.description}>{task.description}</div>
          ) : (
            <div className={styles.description}>(No description)</div>
          )}
          <div className={styles.rowWrapper}>
            <div className={styles.label}>Assignee</div>
            <div className={styles.body}>Not assigned</div>
          </div>
          <div className={styles.rowWrapper}>
            <div className={styles.label}>Status</div>
            {task.isChecked ? (
              <div className={styles.body}>Done</div>
            ) : (
              <div className={styles.body}>Not done</div>
            )}
          </div>
          <div className={styles.rowWrapper}>
            <div className={styles.label}>Date created</div>
            <div className={styles.body}>
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(task.dateCreated)}
            </div>
          </div>
        </div>
      </Page>
    );
  }
}
