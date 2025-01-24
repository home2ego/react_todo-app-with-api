// #region imports
import { useEffect, useRef, useState } from 'react';

import * as todoService from './api/todos';
import { Todo, TodoAdd, TodoUpdate } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { ErrorOptions } from './types/ErrorOptions';
import { DEFAULT_ID } from './constants/DEFAULT_ID';

import UserWarning from './UserWarning';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import TodoError from './components/TodoError';
// #endregion

export const App: React.FC = () => {
  // #region hooks
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [filterOption, setFilterOption] = useState(FilterOptions.ALL);
  const [errorOption, setErrorOption] = useState(ErrorOptions.NONE);

  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorOption(ErrorOptions.LOAD));
  }, []);
  // #endregion

  // #region filtered todos
  const filteredTodos = todos.filter(todo => {
    switch (filterOption) {
      case FilterOptions.ACTIVE:
        return !todo.completed;
      case FilterOptions.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });
  // #endregion

  // #region event handlers - add & delete
  function onAdd(todoDataAdd: TodoAdd) {
    const { userId, title, completed } = todoDataAdd;

    setLoadingTodoIds([DEFAULT_ID]);
    setTempTodo({ id: DEFAULT_ID, userId, title, completed });

    todoService
      .addTodos({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);

        if (titleRef.current) {
          titleRef.current.value = '';
        }
      })
      .catch(() => setErrorOption(ErrorOptions.ADD))
      .finally(() => {
        setLoadingTodoIds([]);
        setTempTodo(null);
      });
  }

  function onDelete(todoIds: number[]) {
    setLoadingTodoIds(todoIds);

    todoIds.map((todoId: number) =>
      todoService
        .deleteTodos(todoId)
        .then(() =>
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          ),
        )
        .catch(() => setErrorOption(ErrorOptions.DELETE))
        .finally(() => setLoadingTodoIds([])),
    );
  }

  function onUpdate(todosDataUpdate: TodoUpdate[]) {
    const todoIds = todosDataUpdate.map(todo => todo.id);

    setLoadingTodoIds(todoIds);

    todosDataUpdate.map((todoDataUpdate: TodoUpdate) => {
      const { id, completed } = todoDataUpdate;

      return todoService
        .updateTodos({ id, completed })
        .then(updatedTodo =>
          setTodos(currentTodos =>
            currentTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
          ),
        )
        .catch(() => setErrorOption(ErrorOptions.UPDATE))
        .finally(() => setLoadingTodoIds([]));
    });
  }
  // #endregion

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          titleRef={titleRef}
          onAdd={onAdd}
          onError={setErrorOption}
          onUpdate={onUpdate}
          isLoading={loadingTodoIds.length > 0}
        />

        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          loadingTodoIds={loadingTodoIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterOption={filterOption}
            onFilter={setFilterOption}
            onDelete={onDelete}
          />
        )}
      </div>

      <TodoError errorOption={errorOption} onError={setErrorOption} />
    </div>
  );
};
