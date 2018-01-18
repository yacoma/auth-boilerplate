import { Compute } from 'cerebral'
import { state } from 'cerebral/tags'

export default Compute(
  state`headerText`,
  state`user.nickname`,
  (header, nickname) => {
    return header.replace('{nickname}', nickname)
  }
)
