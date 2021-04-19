import {
  LoginView,
  WelcomeView,
  EditorView,
  ReaderView,
  ConverterView
} from '../views'

export default [
  {path: '/', exact: true, component: WelcomeView},
  {path: '/login', component: LoginView},
  {path:'/w/:templateUid', component: EditorView},
  {path:'/r/:documentUid', component: ReaderView},
  {pat: '/converter', component: ConverterView}
]