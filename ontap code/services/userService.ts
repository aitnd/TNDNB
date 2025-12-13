import { supabase } from './supabaseClient';

export const getDefaultAvatar = (roleOrName?: string): string => {
    // Return a default avatar based on role or just a generic one
    if (roleOrName === 'admin') return 'https://cdn-icons-png.flaticon.com/512/2304/2304226.png';
    if (roleOrName === 'teacher' || roleOrName === 'giao_vien') return 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(roleOrName || 'User')}&background=random`;
};

export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};
