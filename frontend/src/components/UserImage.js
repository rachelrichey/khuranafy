import React, { useEffect, useState } from 'react';

const UserImage = ({ accessToken }) => {
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('https://api.spotify.com/v1/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                    },
                });

                const data = await response.json();

                // Extract the profile picture URL
                const url = data.images.length > 0 ? data.images[0].url : null;
                setProfilePictureUrl(url);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        // Call the function to retrieve the user profile
        fetchUserProfile();
    }, [accessToken]);

    return (
        <div>
            {profilePictureUrl && (
                <img src={profilePictureUrl} alt="Profile" />
            )}
        </div>
    );
};

export default UserImage;