import { useState } from 'react';

interface MediaPreviewProps {
  src?: string;
  onUpload: (file: File) => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ src, onUpload }) => {
  const [preview, setPreview] = useState<string | null>(src || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {preview ? (
        <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-full" />
      ) : (
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500">Pas d'image</span>
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
    </div>
  );
};

export default MediaPreview;