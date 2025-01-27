import cn from 'classnames';
import { USER_ID } from '../api/todos';
import { Todo, TodoAdd, TodoUpdate } from '../types/Todo';
import { ErrorOptions } from '../types/ErrorOptions';

type Props = {
  todos: Todo[];
  titleRef: React.RefObject<HTMLInputElement>;
  onAdd: (todoDataAdd: TodoAdd) => void;
  onError: (newErrorOption: ErrorOptions) => void;
  onUpdate: (todosDataUpdate: TodoUpdate[]) => Promise<boolean>[];
};

export default function Header({
  todos,
  titleRef,
  onAdd,
  onError,
  onUpdate,
}: Props) {
  const hasAllTodosCompleted = todos.every(todo => todo.completed);

  const handleAddTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedTitleRef = titleRef.current?.value.trim();

    if (formattedTitleRef) {
      onAdd({
        userId: USER_ID,
        title: formattedTitleRef,
        completed: false,
      });
    } else {
      onError(ErrorOptions.EMPTY);
    }
  };

  const handleTodosToggle = () => {
    let todosDataUpdate;

    if (hasAllTodosCompleted) {
      todosDataUpdate = todos.map(todo => {
        const { id, title } = todo;

        return { id, title, completed: false };
      });
    } else {
      todosDataUpdate = todos
        .filter(todo => !todo.completed)
        .map(todo => {
          const { id, title } = todo;

          return { id, title, completed: true };
        });
    }

    onUpdate(todosDataUpdate);
  };

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
