import TripTable from './TripTable'
import { columns, data } from './data'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Vehicle Dashboard</h1>
      {/* <h3><em>TODO: Fill in this table with as much useful information as possible</em></h3> */}
      <TripTable columns={columns} data={data} />
    </div>
  )
}

export default App
