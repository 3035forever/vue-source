import Vue from 'vue'
import {
  // 导入组件
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Select,
  Option,
  MessageBox,
  Tabs,
  TabPane,
  Switch,
  InputNumber,
  DatePicker,
  TimePicker,
  Tooltip,
  Image,
  Upload,
  Carousel,
  CarouselItem,
  Tag,
  Loading,
  Cascader,
  Alert
} from 'element-ui'

// 注册全局组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Switch)
Vue.use(InputNumber)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Tooltip)
Vue.use(Image)
Vue.use(Upload)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Tag)
Vue.use(Loading)
Vue.use(Cascader)
Vue.use(Alert)

// 全局挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
