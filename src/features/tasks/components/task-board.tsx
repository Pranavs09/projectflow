"use client";

import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { updateTaskStatus } from "@/features/tasks/actions/update-task-status";

type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

type TaskBoardItem = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: string;
  assignee: {
    id: string;
    name: string;
    email: string;
  } | null;
};

type TaskBoardProps = {
  initialTasks: TaskBoardItem[];
};

const columns = [
  { key: "TODO", label: "To do" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "IN_REVIEW", label: "In review" },
  { key: "DONE", label: "Done" },
] as const;

function DraggableTask({
  task,
}: {
  task: TaskBoardItem;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded-lg border border-slate-800 bg-slate-950 p-4 transition ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <h4 className="font-medium">
        {task.title}
      </h4>

      <p className="mt-2 line-clamp-2 text-sm text-slate-400">
        {task.description ?? "No description provided."}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="rounded-full border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-300">
          {task.priority}
        </span>

        <span className="truncate text-xs text-slate-500">
          {task.assignee?.name ?? "Unassigned"}
        </span>
      </div>
    </article>
  );
}

function DroppableColumn({
  id,
  children,
}: {
  id: TaskStatus;
  children: React.ReactNode;
}) {
  const {
    isOver,
    setNodeRef,
  } = useDroppable({
    id,
  });

  return (
    <section
      ref={setNodeRef}
      className={`rounded-xl border p-4 transition ${
        isOver
          ? "border-blue-500 bg-blue-950/30"
          : "border-slate-800 bg-slate-900/50"
      }`}
    >
      {children}
    </section>
  );
}

export function TaskBoard({
  initialTasks,
}: TaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [error, setError] = useState<string | null>(null);

  const tasksByStatus = {
    TODO: tasks.filter(
      (task) => task.status === "TODO",
    ),
    IN_PROGRESS: tasks.filter(
      (task) => task.status === "IN_PROGRESS",
    ),
    IN_REVIEW: tasks.filter(
      (task) => task.status === "IN_REVIEW",
    ),
    DONE: tasks.filter(
      (task) => task.status === "DONE",
    ),
  };

  async function handleDragEnd(
    event: DragEndEvent,
  ) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = String(active.id);
    const newStatus = String(over.id) as TaskStatus;

    const task = tasks.find(
      (item) => item.id === taskId,
    );

    if (!task || task.status === newStatus) {
      return;
    }

    const previousTasks = tasks;

    setError(null);

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === taskId
          ? {
              ...item,
              status: newStatus,
            }
          : item,
      ),
    );

    const result = await updateTaskStatus({
      taskId,
      status: newStatus,
    });

    if (!result.success) {
      setTasks(previousTasks);

      setError(
        result.error ??
          "Unable to update task status.",
      );
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {error && (
        <div className="mb-4 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-4">
        {columns.map((column) => {
          const columnTasks =
            tasksByStatus[column.key];

          return (
            <DroppableColumn
              key={column.key}
              id={column.key}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {column.label}
                </h3>

                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                  {columnTasks.length}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {columnTasks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-500">
                    No tasks
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <DraggableTask
                      key={task.id}
                      task={task}
                    />
                  ))
                )}
              </div>
            </DroppableColumn>
          );
        })}
      </div>
    </DndContext>
  );
}