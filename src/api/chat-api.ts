import HTTP from '../utils/HTTP'
import { BaseAPI, handleResponse } from './base-api';

const http = new HTTP('https://ya-praktikum.tech/api/v2/chats');

class ChatAPI extends BaseAPI {

    getChats(offset: number | null = null, limit: number | null = null, title: string | null = null) {
        const data: Record<string, string | number> = {};

        if (offset) data.offset = offset;
        if (limit)  data.limit  = limit;
        if (title)  data.title  = title;

        return  handleResponse(http.get('/', {data: JSON.stringify(data)}), 200);
    }

    createChat(title: string) {
        return handleResponse(http.post('/', {data: JSON.stringify({title: title})}), 200);
    }

    deleteChat(chatId: number){
        return handleResponse(http.delete('/', {data: JSON.stringify({chatId: chatId})}), 200);
    }

    getChatFiles(id: number) {
        return handleResponse(http.get(`/${id}/files`, {}), 200);
    }

    getArchivedChats(offset: number | null = null, limit: number | null = null, title: string | null = null) {
        const data: Record<string, string | number> = {};

        if (offset) data.offset = offset;
        if (limit)  data.limit  = limit;
        if (title)  data.title  = title;

        return handleResponse(http.get('/archive', {data: JSON.stringify(data)}), 200);
    }

    archiveChat(chatId: number) {
        return handleResponse(http.post('/archive', {data: JSON.stringify({chatId: chatId})}), 200);
    }

    unarchiveChat(chatId: number) {
        return handleResponse(http.post('/archive', {data: JSON.stringify({chatId: chatId})}), 200);
    }

    getCommonChat(id: number) {
        return handleResponse(http.get(`/${id}/common`, {}), 200);
    }

    getChatUsers(
            id:     number,
            offset: number | null = null,
            limit:  number | null = null,
            name:   string | null = null,
            email:  string | null = null
        ) {
            const data: Record<string, string | number> = {};

            if (offset) data.offset = offset;
            if (limit)  data.limit  = limit;
            if (name)   data.title  = name;
            if (email)  data.email  = email;

            return handleResponse(http.get(`/${id}/users`,{data: JSON.stringify(data)}), 200);
    }

    getNewMessagesCount(id: number) {
        return handleResponse(http.get(`/new/${id}`), 200);
    }

    uploadChatAvatar(formData: FormData) {
        return handleResponse(http.put('/avatar', {data: formData}), 200);
    }

    addUsersToChat(usersRequest: {users: number[], chatId: number}) {
        return handleResponse(http.put('/users', {data: JSON.stringify(usersRequest)}), 200)
    }

    deleteUsersFromChat(usersRequest: {users: number[], chatId: number}) {
        return handleResponse(http.delete('/users', {data: JSON.stringify(usersRequest)}), 200)
    }

    requestChatToken(id: string) {
        return handleResponse(http.post(`/token/${id}`, {}),200);
    }
}

export default new ChatAPI();
