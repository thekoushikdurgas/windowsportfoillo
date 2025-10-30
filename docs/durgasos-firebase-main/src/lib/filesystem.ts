export type FileSystemItem = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  content?: string; // For files
  children?: FileSystemItem[];
};

export const mockFileSystem: FileSystemItem[] = [
  {
    id: 'users',
    name: 'Users',
    type: 'folder',
    children: [
      {
        id: 'durgas',
        name: 'Durgas',
        type: 'folder',
        children: [
          {
            id: 'desktop',
            name: 'Desktop',
            type: 'folder',
            children: [
              { id: 'screenshot-1.png', name: 'screenshot-1.png', type: 'file' },
            ],
          },
          {
            id: 'documents',
            name: 'Documents',
            type: 'folder',
            children: [
              { id: 'project-plan.pdf', name: 'project-plan.pdf', type: 'file' },
              { id: 'notes.txt', name: 'notes.txt', type: 'file', content: 'This is a note inside a text file.' },
              { id: 'sample.mp4', name: 'sample.mp4', type: 'file', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
            ],
          },
          {
            id: 'downloads',
            name: 'Downloads',
            type: 'folder',
            children: [],
          },
          {
            id: 'pictures',
            name: 'Pictures',
            type: 'folder',
            children: [
                { id: 'avatar.jpg', name: 'avatar.jpg', type: 'file' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'windows',
    name: 'Windows',
    type: 'folder',
    children: [
        { id: 'system32', name: 'system32', type: 'folder', children: [] }
    ],
  },
  {
    id: 'program-files',
    name: 'Program Files',
    type: 'folder',
    children: [],
  },
];
