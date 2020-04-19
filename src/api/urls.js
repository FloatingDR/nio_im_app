// websocket
export const WS_URL = 'ws://localhost:8081/websocket';
// user
export const GetUserById = `/user/getById`;
export const UpdateUserInfo = `/user/update`;
export const Login = `/user/login`;
export const Register = `/user/register`;

// cache
export const GetCache = `/user_cache/get_cache`;
export const CacheMsg = `/user_cache/cache_msg`;
export const DeleteCache = `/user_cache/delete_cache`;

// dictionary
export const GetAreaList = `/dictionary/getAreaList`;

// fileUpload
export const UploadFile = `/file/uploadHeaderImg`;
export const Upload = `/file/upload`;

// group
export const GetGroupInfo = `/group/get_group`;

// message
export const ReadBatch = `/message/read_batch`;
export const Read_batch_by_sendIdAndType = `/message/read_batch_by_sendIdAndType`;
export const GetUnreadList = `/user_cache/get_unreadList`;

// friends
export const AddFriends = `/friends/add_friends`;
export const RemoveFriends = `/friends/remove_friends`;
export const ListMyFriends = `/friends/listMyFriends`;
export const ListCommonFriends = `/friends/listCommonFriends`;
