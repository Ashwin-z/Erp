import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Image as ImageIcon } from "lucide-react";
import moment from 'moment';

export default function ThumbnailGrid({ files, onSelect }) {
  if (!files || files.length === 0) {
    return (
        <div className="text-center py-12 text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No items to display</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {files.map((file) => (
        <Card 
            key={file.id} 
            className="group cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:shadow-lg transition-all overflow-hidden border-slate-200"
            onClick={() => onSelect && onSelect(file)}
        >
          <div className="aspect-[3/4] bg-slate-100 relative flex items-center justify-center overflow-hidden">
            {/* Simulated Thumbnail - In prod this would come from file.thumbnail_url */}
            {file.thumbnail_url ? (
                <img src={file.thumbnail_url} alt={file.file_name} className="w-full h-full object-cover" />
            ) : file.mime_type?.includes('image') ? (
                <img src={file.file_url} alt={file.file_name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform" />
            ) : (
                <div className="flex flex-col items-center text-slate-400">
                    <FileText className="w-12 h-12 mb-2" />
                    <span className="text-xs font-mono uppercase">{file.file_name.split('.').pop()}</span>
                </div>
            )}
            
            {/* Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium truncate">{file.file_name}</p>
                <p className="text-slate-300 text-[10px]">{moment(file.created_date).fromNow()}</p>
            </div>
          </div>
          
          {/* Minimal Footer */}
          <div className="p-2 bg-white border-t border-slate-100">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 truncate max-w-[70%]">
                    {JSON.parse(file.metadata_json || '{}').vendor || file.file_name}
                </span>
                {JSON.parse(file.metadata_json || '{}').amount && (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        {JSON.parse(file.metadata_json || '{}').amount}
                    </span>
                )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}