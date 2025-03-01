'use client'

const API_PATH = process.env.NEXT_PUBLIC_API_URL

export const useApi = () => {
    const routes = {
        findPackages: API_PATH ? `${API_PATH}/api/find-packages` : `api/find-packages`,
        killCommand: API_PATH ? `${API_PATH}/api/kill-command` : `api/kill-command`,
        monitorProcess: API_PATH ? `${API_PATH}/api/monitor-processes` : `api/monitor-processes`,
        openEditor: API_PATH ? `${API_PATH}/api/open-editor` : `api/open-editor`,
        runCommand: API_PATH ? `${API_PATH}/api/run-command` : `api/run-command`,
        switchBranch: API_PATH ? `${API_PATH}/api/switch-branch` : `api/switch-branch`,
        latestVersion: API_PATH ? `${API_PATH}/api/check-updates` : `api/check-updates`,
        usedPorts: API_PATH ? `${API_PATH}/api/used-ports` : `api/used-ports`,
        killPortProcess: API_PATH ? `${API_PATH}/api/kill-port-process` : `api/kill-port-process`,
    }

    return { routes }
}