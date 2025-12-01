import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MoreHorizontal } from 'lucide-react';

export default function CommentsPanel({ resourceId, resourceType }) {
  const [comments, setComments] = React.useState([
    { id: 1, user: "Sarah Chen", text: "We need to adjust the risk threshold here.", time: "2h ago", avatar: "SC" },
    { id: 2, user: "Mike Ross", text: "Agreed, updated the condition to > $5k.", time: "1h ago", avatar: "MR" }
  ]);
  const [newComment, setNewComment] = React.useState("");

  const handleSend = () => {
    if (!newComment.trim()) return;
    setComments([...comments, {
      id: Date.now(),
      user: "Current User",
      text: newComment,
      time: "Just now",
      avatar: "CU"
    }]);
    setNewComment("");
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-bold text-slate-300">Discussion ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="w-8 h-8 border border-slate-700">
              <AvatarFallback className="bg-slate-800 text-xs">{comment.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300">{comment.user}</span>
                <span className="text-[10px] text-slate-500">{comment.time}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/50 p-2 rounded-lg rounded-tl-none">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="p-3 border-t border-slate-800 flex gap-2">
        <Input 
          placeholder="Add a comment..." 
          className="h-9 text-xs bg-slate-950 border-slate-700 text-white"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button size="sm" variant="ghost" className="h-9 w-9 p-0" onClick={handleSend}>
          <Send className="w-4 h-4 text-blue-400" />
        </Button>
      </div>
    </Card>
  );
}