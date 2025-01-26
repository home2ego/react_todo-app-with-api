/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

// #region imports
import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo, TodoUpdate } from '../types/Todo';
// #endregion

// #region type Props
type Props = {
  todo: Todo;
  onDelete?: (todoId: [number]) => void;
  onUpdate?: (todoDataUpdate: [TodoUpdate]) => Promise<boolean>[];
  isLoading: boolean;
};
// #endregion

const getPreparedTodo = (id: number, title: string, completed: boolean) => ({
  id,
  title,
  completed,
});

export default function TodoItem({
  todo,
  onDelete = () => {},
  onUpdate = () => [],
  isLoading,
}: Props) {
  const { id, title, completed } = todo;

  // #region hooks
  const [editTitle, setEditTitle] = useState(title);
  const [hasEditTitle, setHasEditTitle] = useState(false);

  const titleEditRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleEditRef.current?.focus();
  }, [hasEditTitle]);
  // #endregion

  // #region event handlers
  const handleTodoUpdate = () => {
    const formattedEditTitle = editTitle.trim();

    if (!formattedEditTitle) {
      onDelete([id]);

      return;
    }

    if (formattedEditTitle !== title) {
      setEditTitle(formattedEditTitle);
      setHasEditTitle(false);

      const preparedEditTodoUpdate = getPreparedTodo(
        id,
        formattedEditTitle,
        completed,
      );

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
    const preparedToggleTodoUpdate = getPreparedTodo(id, title, !completed);

    onUpdate([preparedToggleTodoUpdate]);
  };

  const handleTodoKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditTitle(title);
      setHasEditTitle(false);
    }
  };
  // #endregion

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
