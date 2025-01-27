import cn from 'classnames';
import { ErrorOptions } from '../types/ErrorOptions';

type Props = {
  errorOption: ErrorOptions;
  onError: (newErrorOption: ErrorOptions) => void;
};

export default function TodoError({ errorOption, onError }: Props) {
  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorOption === ErrorOptions.NONE,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => onError(ErrorOptions.NONE)}
        />
        {errorOption}
      </div>
    </>
  );
}
