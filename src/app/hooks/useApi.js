'use client'

const API_PATH = process.env.NEXT_PUBLIC_API_URL

export const useApi = () => {
    const routes = {
        findPackages: API_PATH ? `${API_PATH}/api/find-packages` : `api/find-packages`,
        killCommand: API_PATH ? `${API_PATH}/api/kill-command` : `api/kill-command`,
        monitorProcess: API_PATH ? `${API_PATH}/api/monitor-process` : `api/monitor-process`,
        openEditor: API_PATH ? `${API_PATH}/api/open-editor` : `api/open-editor`,
        runCommand: API_PATH ? `${API_PATH}/api/run-command` : `api/run-command`,
        switchBranch: API_PATH ? `${API_PATH}/api/switch-branch` : `api/switch-branch`,
    }

    return { routes }
}