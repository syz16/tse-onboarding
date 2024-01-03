import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Task } from "src/api/tasks";
import { updateTask } from "src/api/tasks";
import { CheckButton } from "src/components";
import styles from "src/components/TaskItem.module.css";

export interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task: initialTask }: TaskItemProps) {
  const [task, setTask] = useState<Task>(initialTask);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleToggleCheck = () => {
    setLoading(true);
    updateTask({ ...task, isChecked: !task.isChecked, assignee: task.assignee?._id }).then(
      (result) => {
        if (result.success) {
          setTask(result.data);
        } else {
          alert(result.error);
        }
        setLoading(false);
      },
    );
  };

  let checkedClass = styles.textContainer;
  if (task.isChecked) {
    checkedClass += ` ${styles.checked}`;
  }
  return (
    <div className={styles.item}>
      {<CheckButton checked={task.isChecked} onPress={handleToggleCheck} disabled={isLoading} />}
      <div className={checkedClass}>
        <Link to={`/task/${task._id}`}>
          <span className={styles.title}>{task.title}</span>
        </Link>
        {task.description && <span className={styles.description}>{task.description}</span>}
      </div>
    </div>
  );
}
