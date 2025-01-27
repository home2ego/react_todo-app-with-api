/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo, TodoUpdate } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (todoId: [number]) => void;
  onUpdate?: (todoDataUpdate: [TodoUpdate]) => Promise<boolean>[];
  isLoading: boolean;
};

export default function TodoItem({
  todo,
  onDelete = () => {},
  onUpdate = () => [],
  isLoading,
}: Props) {
  const { id, title, completed } = todo;

  const [editTitle, setEditTitle] = useState(title);
  const [hasEditTitle, setHasEditTitle] = useState(false);
  const titleEditRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleEditRef.current?.focus();
  }, [hasEditTitle]);

  const handleTodoUpdate = () => {
    const formattedEditTitle = editTitle.trim();

    if (!formattedEditTitle) {
      onDelete([id]);

      return;
    }

    if (formattedEditTitle !== title) {
      setEditTitle(formattedEditTitle);
      setHasEditTitle(false);

      const preparedEditTodoUpdate = {
        id,
        title: formattedEditTitle,
        completed,
      };

      onUpdate([preparedEditTodoUpdate]).forEach(promise => {
        promise.then(response => {
          if (!response) {
            setHasEditTitle(true);
          }
        });
      });
    } else {
      setEditTitle(title);
      setHasEditTitle(false);
    }
  };

  const handleEditTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    handleTodoUpdate();
  };

  const handleTodoToggle = () => {
    const preparedToggleTodoUpdate = { id, title, completed: !completed };

    onUpdate([preparedToggleTodoUpdate]);
  };

  const handleTodoKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditTitle(title);
      setHasEditTitle(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoToggle}
        />
      </label>

      {hasEditTitle ? (
        <form onSubmit={handleEditTodoSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={titleEditRef}
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleTodoUpdate}
            onKeyUp={handleTodoKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setHasEditTitle(true)}
          >
            {editTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete([id])}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}
