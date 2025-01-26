// #region imports
import { useEffect, useState } from 'react';

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

export default function App() {
  // #region hooks
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [filterOption, setFilterOption] = useState(FilterOptions.ALL);
  const [errorOption, setErrorOption] = useState(ErrorOptions.NONE);

  const [hasFocus, setHasFocus] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

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
  const onAdd = (todoDataAdd: TodoAdd) => {
    setHasFocus(true);
    setLoadingTodoIds([DEFAULT_ID]);
    setTempTodo({ ...todoDataAdd, id: DEFAULT_ID });

    return todoService
      .addTodos(todoDataAdd)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);

        return true;
      })
      .catch(() => {
        setErrorOption(ErrorOptions.ADD);

        return false;
      })
      .finally(() => {
        setHasFocus(false);
        setLoadingTodoIds([]);
        setTempTodo(null);
      });
  };

  const onDelete = (todoIds: number[]) => {
    setHasFocus(true);
    setLoadingTodoIds(todoIds);

    for (const todoId of todoIds) {
      todoService
        .deleteTodos(todoId)
        .then(() =>
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          ),
        )
        .catch(() => setErrorOption(ErrorOptions.DELETE))
        .finally(() => {
          setHasFocus(true);
          setLoadingTodoIds([]);
        });
    }
  };

  const onUpdate = (todosDataUpdate: TodoUpdate[]) => {
    const todoIds = todosDataUpdate.map(todo => todo.id);

    setLoadingTodoIds(todoIds);

    return todosDataUpdate.map(todoDataUpdate => {
      return todoService
        .updateTodos(todoDataUpdate)
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(todo =>
              todo.id === todoDataUpdate.id ? updatedTodo : todo,
            ),
          );

          return true;
        })
        .catch(() => {
          setErrorOption(ErrorOptions.UPDATE);

          return false;
        })
        .finally(() => setLoadingTodoIds([]));
    });
  };
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
          hasFocus={hasFocus}
          onAdd={onAdd}
          onError={setErrorOption}
          onUpdate={onUpdate}
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
}
