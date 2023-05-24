import { writable } from 'svelte/store';

function createUser() {
    const currentUser = JSON.parse(localStorage.getItem('gotrue.user'));
    console.log("currentUser: ", currentUser);

    const { subscribe, set, update } = writable(currentUser);

    return {
		subscribe,
        register: (user) => {
            console.log("user: ", user);
            return set(user)},
        lsCheck: () => {
            console.log('lsCheck: ', JSON.parse(localStorage.getItem('gotrue.user')));
            return set(JSON.parse(localStorage.getItem('gotrue.user')))},
		logout: () => set(null)
	};

}
export const user = createUser();
export const siteURL = writable("");
export const settings = writable(undefined);
export const events = writable(undefined);
export const locations = writable(undefined);
