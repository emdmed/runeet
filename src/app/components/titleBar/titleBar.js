'use client'

const TitleBar = () => {
    return <div style={{ cursor: "move" }} data-tauri-drag-region className="flex h-5 gap-2 w-full justify-center items-center">
        <div data-tauri-drag-region className="w-[120px] h-[7px] bg-primary rounded-full opacity-50"></div>
    </div>
}

export default TitleBar