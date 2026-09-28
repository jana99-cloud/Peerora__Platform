import { useState } from 'react';
import { Info, X, Sparkles } from 'lucide-react';

export function AboutUsSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-6">
      {/* زر عريض وبارز مكتوب عليه About us */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2.5 rounded-btn bg-navy-500 py-3.5 px-6 text-sm font-bold text-white shadow-soft transition-all hover:bg-navy-600 hover:shadow-pop"
      >
        <Info size={18} className="text-lavender-300" />
        <span className="font-display tracking-wide">About us</span>
      </button>

      {/* البطاقة التفاعلية التي تظهر عند الضغط مع تنسيق المسافات والحواف */}
      {isOpen && (
        <div className="mt-3 relative rounded-card-lg border-2 border-cream-300 bg-white p-6 sm:p-8 shadow-card animate-fade-in">
          {/* زر الإغلاق */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-navy-400 hover:text-navy-600 transition"
            title="Close"
          >
            <X size={20} />
          </button>

          {/* العنوان والأيقونة */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600">
              <Sparkles size={20} />
            </div>
            <h3 className="font-display text-xl font-extrabold text-navy-900 tracking-tight">
              About PEERORA
            </h3>
          </div>

          {/* النص التعريفي بخط مريح للقراءة */}
          <p className="text-sm sm:text-base font-medium text-navy-600 leading-relaxed">
            PEERORA is an academic platform that brings students from different disciplines together to work on shared projects through open posts and organized collaboration spaces. We help students discover suitable opportunities, form teams, and execute tasks inside a fully integrated Workspace that supports discussion, task management, file sharing, and an intelligent assistant that keeps the project organized from start to finish.
          </p>
        </div>
      )}
    </div>
  );
}
