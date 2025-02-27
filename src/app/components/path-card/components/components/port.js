import { Input } from "../../../../../components/ui/input"

const Port = ({ setPort, port, currentProcess }) => {
    return <div className="flex gap-1 items-center">
        <small className="text-secondary">Port</small>
        <Input value={port} onChange={e => setPort(e.target.value)} placeholder="default" className="h-[25px] max-w-[90px] text-center placeholder:text-secondary placeholder:opacity-40"></Input>
    </div>
}

export default Port