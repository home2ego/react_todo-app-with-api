// #region imports
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo, TodoUpdate } from '../types/Todo';
import { DEFAULT_ID } from '../constants/DEFAULT_ID';
import TodoItem from './TodoItem';
// #endregion

// #region type Props
type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: [number]) => void;
  onUpdate: (todoDataUpdate: [TodoUpdate]) => Promise<boolean>[];
  loadingTodoIds: number[];
};
// #endregion

export default function TodoList({
  filteredTodos,
  tempTodo,
  onDelete,
  onUpdate,
  loadingTodoIds,
}: Props) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isLoading={loadingTodoIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isLoading={loadingTodoIds.includes(DEFAULT_ID)}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
}
