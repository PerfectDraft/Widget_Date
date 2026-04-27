const DRIVE_FILE_NAME = 'database.json';

export interface AppDatabase {
  combos: any[];
  userReward: {
    miles: number;
    completedDates: number;
    badges: string[];
  };
  preferences?: string[];
}

/**
 * Searches for database.json in the AppData folder.
 * Returns the file ID if found, otherwise null.
 */
export async function getDatabaseFileId(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${DRIVE_FILE_NAME}'&fields=files(id)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!res.ok) throw new Error('Failed to query drive');
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  } catch (error) {
    console.error('Error finding database file:', error);
  }
  return null;
}

/**
 * Creates a new blank database.json in the AppData folder and returns its file ID.
 */
export async function createDatabaseFile(accessToken: string, initialData: AppDatabase): Promise<string | null> {
  try {
    const metadata = {
      name: DRIVE_FILE_NAME,
      parents: ['appDataFolder'],
    };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([JSON.stringify(initialData)], { type: 'application/json' }));

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    });

    if (!res.ok) throw new Error('Failed to create file');
    const data = await res.json();
    return data.id;
  } catch (error) {
    console.error('Error creating database file:', error);
  }
  return null;
}

/**
 * Downloads and parses the database JSON file.
 */
export async function readDatabase(accessToken: string, fileId: string): Promise<AppDatabase | null> {
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) throw new Error('Failed to read file');
    return await res.json();
  } catch (error) {
    console.error('Error reading database file:', error);
  }
  return null;
}

/**
 * Updates the existing database.json file with new data.
 */
export async function writeDatabase(accessToken: string, fileId: string, data: AppDatabase): Promise<boolean> {
  try {
    const res = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (error) {
    console.error('Error writing database file:', error);
    return false;
  }
}
