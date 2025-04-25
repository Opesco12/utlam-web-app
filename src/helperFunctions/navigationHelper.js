import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

history.navigate = (path, options = {}) => {
  if (options.replace) {
    history.replace(path);
  } else {
    history.push(path);
  }
};
