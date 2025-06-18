import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './store/store';
import { router } from './router';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider
        router={router}
        future={{
          v7_relativeSplatPath: true
        }}
      />
    </Provider>
  );
}

export default App;
