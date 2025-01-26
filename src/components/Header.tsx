// #region imports
import { useEffect, useRef } from 'react';
import cn from 'classnames';

import { USER_ID } from '../api/todos';
import { Todo, TodoAdd, TodoUpdate } from '../types/Todo';
import { ErrorOptions } from '../types/ErrorOptions';
// #endregion

// #region type Props
type Props = {
  todos: Todo[];
  hasFocus: boolean;
  onAdd: (todoDataAdd: TodoAdd) => Promise<boolean>;
  onError: (newErrorOption: ErrorOptions) => void;
  onUpdate: (todosDataUpdate: TodoUpdate[]) => Promise<boolean>[];
};
// #endregion

const getTodosDataUpdate = (id: number, title: string, completed: boolean) => ({
  id,
  title,
  completed,
});

export default function Header({
  todos,
  hasFocus,
  onAdd,
  onError,
  onUpdate,
}: Props) {
  // #region hooks
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, [hasFocus]);
  // #endregion

  const hasAllTodosCompleted = todos.every(todo => todo.completed);

  // #region event handlers
  const handleAddTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentTitleRef = titleRef.current;

    if (!currentTitleRef?.value.trim()) {
      onError(ErrorOptions.EMPTY);

      return;
    }

    currentTitleRef.disabled = true;

    const todoDataAdd = {
      title: currentTitleRef.value.trim(),
      userId: USER_ID,
      completed: false,
    };

    onAdd(todoDataAdd).then(response => {
      currentTitleRef.disabled = false;

      if (response) {
        currentTitleRef.value = '';
      }
    });
  };

  const handleTodosToggle = () => {
    let todosDataUpdate;

    if (hasAllTodosCompleted) {
      todosDataUpdate = todos.map(todo =>
        getTodosDataUpdate(todo.id, todo.title, false),
      );
    } else {
      todosDataUpdate = todos
        .filter(todo => !todo.completed)
        .map(todo => getTodosDataUpdate(todo.id, todo.title, true));
    }

    onUpdate(todosDataUpdate);
  };
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
          onClick={handleTodosToggle}
        />
      )}

      <form onSubmit={handleAddTodoSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleRef}
        />
      </form>
    </header>
  );
}
