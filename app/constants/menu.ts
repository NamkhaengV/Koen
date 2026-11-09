export interface MenuItem {
    name: string
    icon: string
    route: string
    permissions?: string[]
    children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
    {
        name: 'Text Animation',
        icon: '',
        route: '/text-animation'
    },
    {
        name: 'Chat Widget',
        icon: '',
        route: '/chat-widget'
    },
    {
        name: 'Notifications',
        icon: '',
        route: '/notifications'
    }
];
