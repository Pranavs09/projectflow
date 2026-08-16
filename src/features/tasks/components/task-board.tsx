"use client";

import { useState } from "react";

import { DndContext, type DragEndEvent, useDroppable } from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { updateTaskStatus } from "@/features/tasks/actions/update-task-status";

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

type TaskBoardItem = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: string;
  position: number;

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

function SortableTask({ task }: { task: TaskBoardItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab rounded-lg border border-slate-800 bg-slate-950 p-4 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <h4 className="font-medium">{task.title}</h4>

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
  const { isOver, setNodeRef } = useDroppable({
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

export function TaskBoard({ initialTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [error, setError] = useState<string | null>(null);

  const tasksByStatus = {
    TODO: tasks
      .filter((task) => task.status === "TODO")
      .sort((a, b) => a.position - b.position),

    IN_PROGRESS: tasks
      .filter((task) => task.status === "IN_PROGRESS")
      .sort((a, b) => a.position - b.position),

    IN_REVIEW: tasks
      .filter((task) => task.status === "IN_REVIEW")
      .sort((a, b) => a.position - b.position),

    DONE: tasks
      .filter((task) => task.status === "DONE")
      .sort((a, b) => a.position - b.position),
  };

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeTaskId = String(active.id);
    const overID = String(over.id);

    const activeTask = tasks.find((task) => task.id === activeTaskId);

    if (!activeTask) {
      return;
    }

    const previousTasks = tasks;

    setError(null);

    const columnStatuses: TaskStatus[] = [
      "TODO",
      "IN_PROGRESS",
      "IN_REVIEW",
      "DONE",
    ];

    const droppedOnColumn = columnStatuses.includes(overID as TaskStatus);

    if (droppedOnColumn) {
      const newStatus = overID as TaskStatus;

      if (activeTask.status === newStatus) {
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === activeTaskId ? { ...task, status: newStatus } : task,
        ),
      );

      const result = await updateTaskStatus({
        taskId: activeTaskId,
        status: newStatus,
      });

      if (!result.success) {
        setError(result.error ?? "An error occurred while updating the task.");
        setTasks(previousTasks);
      }

      return;
    }

    const overTask = tasks.find((task) => task.id === overID);

    if (!overTask) {
      return;
    }

    if (activeTask.status !== overTask.status) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === activeTaskId
            ? { ...task, status: overTask.status }
            : task,
        ),
      );

      const result = await updateTaskStatus({
        taskId: activeTaskId,
        status: overTask.status,
      });

      if (!result.success) {
        setError(result.error ?? "An error occurred while updating the task.");
        setTasks(previousTasks);
      }

      return;
    }

    const sameColumnTasks = tasksByStatus[activeTask.status];

    const oldIndex = sameColumnTasks.findIndex(
      (task) => task.id === activeTaskId,
    );
    const newIndex = sameColumnTasks.findIndex((task) => task.id === overID);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
      return;
    }

    const reorderedColumnTasks = arrayMove(sameColumnTasks, oldIndex, newIndex);

    setTasks((currentTasks) => {
      const otherTasks = currentTasks.filter(
        (task) => task.status !== activeTask.status,
      );

      const reorderedTasks = reorderedColumnTasks.map((task, index) => ({
        ...task,
        position: index,
      }));

      return [...otherTasks, ...reorderedTasks];
    });
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
          const columnTasks = tasksByStatus[column.key];

          return (
            <DroppableColumn key={column.key} id={column.key}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{column.label}</h3>

                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                  {columnTasks.length}
                </span>
              </div>

              <SortableContext
                items={columnTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="mt-4 space-y-3">
                  {columnTasks.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-500">
                      No tasks
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <SortableTask key={task.id} task={task} />
                    ))
                  )}
                </div>
              </SortableContext>
            </DroppableColumn>
          );
        })}
      </div>
    </DndContext>
  );
}
