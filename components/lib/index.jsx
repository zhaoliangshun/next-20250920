import PickerRoot from './components/Picker'
import PickerColumn from './components/PickerColumn'
import PickerItem from './components/PickerItem'

// 创建复合 Picker 组件，包含 Column 和 Item 子组件
const Picker = PickerRoot

// 挂载子组件到 Picker 上
Picker.Column = PickerColumn
Picker.Item = PickerItem

export default Picker