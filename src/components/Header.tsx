// #region imports
import { useEffect } from 'react';
import cn from 'classnames';

import { USER_ID } from '../api/todos';
import { Todo, TodoAdd, TodoUpdate } from '../types/Todo';
import { ErrorOptions } from '../types/ErrorOptions';
// #endregion

// #region type Props
type Props = {
  todos: Todo[];
  titleRef: React.RefObject<HTMLInputElement>;
  onAdd: (todoDataAdd: TodoAdd) => void;
  onError: (newErrorOption: ErrorOptions) => void;
  onUpdate: (todosDataUpdate: TodoUpdate[]) => void;
  isLoading: boolean;
};
// #endregion

export default function Header({
  todos,
  titleRef,
  onAdd,
  onError,
  onUpdate,
  isLoading,
}: Props) {
  useEffect(() => {
    titleRef.current?.focus();
  }, [titleRef, isLoading]);

  const hasAllTodosCompleted = todos.every(todo => todo.completed);

  // #region event handlers
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formattedTitle = titleRef.current?.value.trim();

    if (formattedTitle) {
      const todoDataAdd = {
        title: formattedTitle,
        userId: USER_ID,
        completed: false,
      };

      onAdd(todoDataAdd);
    } else {
      onError(ErrorOptions.EMPTY);
    }
  }

  function handleToggleAll() {
    let todosDataUpdate;

    if (hasAllTodosCompleted) {
      todosDataUpdate = todos.map(todo => ({ id: todo.id, completed: false }));
    } else {
      todosDataUpdate = todos
        .filter(todo => !todo.completed)
        .map(todo => ({ id: todo.id, completed: true }));
    }

    onUpdate(todosDataUpdate);
  }
  // #endregion

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: hasAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
}
