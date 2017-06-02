/**
 * Created by sp41mer on 18.03.17.
 */

export const url = 'http://78.155.219.128:8888';

export const dnevnikUrl = 'http://78.155.219.128:8070/eljur/marks?';

export let user_id = 0;

export function giveIdForKid(user_id){
    if (user_id == 2) return 1;
    else return 2;
}

export const loginUrl = '';

export const logoutUrl = '';

export const tasksUrl = '';

export const taskTypePictures = {
 1: require('./Resources/type_house.png')
};

export const taskMessagesToKid = {
    0: '',
    1: '(ждем...)',
    2: '(готово)'
};

export const marksPictures = {
    '5': require('./Resources/five.png'),
    '4': require('./Resources/four.png'),
    '3': require('./Resources/three.png'),
    '2': require('./Resources/two.png'),
    'н': require('./Resources/progul.png'),
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

export function getMarkPicture(mark){
    return marksPictures[mark];
}
