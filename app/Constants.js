/**
 * Created by sp41mer on 18.03.17.
 */

export const url = 'http://172.20.10.5:8000';

export const loginUrl = '';

export const logoutUrl = '';

export const tasksUrl = '';

export const taskTypePictures = {
 1: require('./Resources/type_house.png')
};
export const userDefaultPictures = {
    'boy': require('./Resources/boy_default.png'),
    'girl': require('./Resources/boy_default.png'),
    'man': require('./Resources/man_default.jpeg'),
    'woman': require('./Resources/woman_default.jpeg')
};

export function getDefaultAvatar(profile) {
    if (profile.type == 0 && profile.gender == 1){
        return userDefaultPictures.man
    }
    else if (profile.type == 0 && profile.gender == 0){
        return userDefaultPictures.woman
    }
    else if (profile.type == 1 && profile.gender == 1){
        return userDefaultPictures.boy
    }
    else if (profile.type == 1 && profile.gender == 1){
        return userDefaultPictures.girl
    }
}

export function getDefaultTaskType(type) {
    return taskTypePictures[type.id]
}