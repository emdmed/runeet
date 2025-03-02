import { Input } from "../../../../../components/ui/input"

const Port = ({ setPort, port }) => {
    return <div className="flex gap-1 items-center">
        <small className="text-secondary">Port</small>
        <Input value={port} onChange={e => setPort(e.target.value)} placeholder="default" className="h-[25px] max-w-[90px] min-w-[80px] text-center"></Input>
    </div>
}

export default Port