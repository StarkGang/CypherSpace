"use client";

import React, { useEffect, useState } from "react";
import { FiExternalLink, FiFileText, FiGrid, FiBook, FiMonitor, FiDownload, FiCalendar, FiClipboard, FiMessageSquare, FiImage } from "react-icons/fi";
import { FaGoogleDrive, FaYoutube, FaGithub, FaFigma, FaLinkedin, FaInstagram, FaMedium, FaTwitter, FaGamepad, FaCode, FaPaintBrush, FaVideo, FaHeadphones } from "react-icons/fa";

const getLinkMeta = (url, customText = null) => {
  if (customText) {
    const textLower = customText.toLowerCase();
    if (textLower.includes('game') || textLower.includes('play')) {
      return { icon: FaGamepad, color: 'bg-[#9C27B0]', text: 'text-white', label: customText, isKnownExternal: false };
    }
    if (textLower.includes('resource') || textLower.includes('doc') || textLower.includes('guide')) {
      return { icon: FiBook, color: 'bg-[#00BCD4]', text: 'text-white', label: customText, isKnownExternal: false };
    }
    if (textLower.includes('repo') || textLower.includes('code') || textLower.includes('source')) {
      return { icon: FaCode, color: 'bg-[#607D8B]', text: 'text-white', label: customText, isKnownExternal: false };
    }
    if (textLower.includes('design') || textLower.includes('ui') || textLower.includes('prototype')) {
      return { icon: FaPaintBrush, color: 'bg-[#E91E63]', text: 'text-white', label: customText, isKnownExternal: false };
    }
    if (textLower.includes('video') || textLower.includes('watch') || textLower.includes('recording') || textLower.includes('demo')) {
      return { icon: FaVideo, color: 'bg-[#F44336]', text: 'text-white', label: customText, isKnownExternal: false };
    }
    if (textLower.includes('slide') || textLower.includes('presentation') || textLower.includes('deck') || textLower.includes('pitch')) {
      return { icon: FiMonitor, color: 'bg-[#FF9800]', text: 'text-white', label: customText, isKnownExternal: false };
    }
    if (textLower.includes('download') || textLower.includes('release') || textLower.includes('asset')) {
      return { icon: FiDownload, color: 'bg-[#4CAF50]', text: 'text-white', label: customText, isKnownExternal: false };
    }
    if (textLower.includes('article') || textLower.includes('blog') || textLower.includes('post')) {
      return { icon: FiFileText, color: 'bg-[#795548]', text: 'text-white', label: customText, isKnownExternal: false };
    }
    if (textLower.includes('audio') || textLower.includes('podcast') || textLower.includes('music') || textLower.includes('sound')) {
      return { icon: FaHeadphones, color: 'bg-[#673AB7]', text: 'text-white', label: customText, isKnownExternal: false };
    }
    if (textLower.includes('schedule') || textLower.includes('calendar') || textLower.includes('agenda')) {
      return { icon: FiCalendar, color: 'bg-[#3F51B5]', text: 'text-white', label: customText, isKnownExternal: false };
    }
    if (textLower.includes('form') || textLower.includes('survey') || textLower.includes('register')) {
      return { icon: FiClipboard, color: 'bg-[#009688]', text: 'text-white', label: customText, isKnownExternal: false };
    }
    if (textLower.includes('chat') || textLower.includes('community') || textLower.includes('discord') || textLower.includes('slack')) {
      return { icon: FiMessageSquare, color: 'bg-[#FF5722]', text: 'text-white', label: customText, isKnownExternal: false };
    }
    if (textLower.includes('image') || textLower.includes('photo') || textLower.includes('album')) {
      return { icon: FiImage, color: 'bg-[#E91E63]', text: 'text-white', label: customText, isKnownExternal: false };
    }
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      return { icon: FaYoutube, color: 'bg-[#FF0000]', text: 'text-white', label: customText || 'YouTube Video', isKnownExternal: true };
    }
    if (host.includes('drive.google.com')) {
      return { icon: FaGoogleDrive, color: 'bg-[#0F9D58]', text: 'text-white', label: customText || 'Google Drive', isKnownExternal: true };
    }
    if (host.includes('github.com')) {
      return { icon: FaGithub, color: 'bg-[#181717]', text: 'text-white', label: customText || 'GitHub Repository', isKnownExternal: true };
    }
    if (host.includes('figma.com')) {
      return { icon: FaFigma, color: 'bg-[#F24E1E]', text: 'text-white', label: customText || 'Figma Design', isKnownExternal: true };
    }
    if (host.includes('linkedin.com')) {
      return { icon: FaLinkedin, color: 'bg-[#0A66C2]', text: 'text-white', label: customText || 'LinkedIn', isKnownExternal: true };
    }
    if (host.includes('instagram.com')) {
      return { icon: FaInstagram, color: 'bg-[#E4405F]', text: 'text-white', label: customText || 'Instagram', isKnownExternal: true };
    }
    if (host.includes('medium.com')) {
      return { icon: FaMedium, color: 'bg-[#000000]', text: 'text-white', label: customText || 'Medium Article', isKnownExternal: true };
    }
    if (host.includes('twitter.com') || host.includes('x.com')) {
      return { icon: FaTwitter, color: 'bg-[#1DA1F2]', text: 'text-white', label: customText || 'Twitter / X', isKnownExternal: true };
    }
    if (parsed.pathname.endsWith('.pdf')) {
      return { icon: FiFileText, color: 'bg-[#FF5722]', text: 'text-white', label: customText || 'PDF Document', isKnownExternal: true };
    }
    if (parsed.pathname.endsWith('.xlsx') || parsed.pathname.endsWith('.csv')) {
      return { icon: FiGrid, color: 'bg-[#21A366]', text: 'text-white', label: customText || 'Spreadsheet', isKnownExternal: true };
    }
    
    return { icon: FiExternalLink, color: 'bg-[var(--color-sticker-pink)]', text: 'text-black', label: customText || host.replace(/^www\./, ''), isKnownExternal: false };
  } catch(e) {
    return { icon: FiExternalLink, color: 'bg-gray-200', text: 'text-black', label: customText || 'External Link', isKnownExternal: false };
  }
};

export default function GalleryImage({ imgUrl: rawImgUrl, title, index }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  let actualUrl = rawImgUrl || "";
  let customText = null;
  if (actualUrl.includes('|')) {
    const parts = actualUrl.split('|');
    actualUrl = parts[0].trim();
    customText = parts[1].trim();
  }

  let isYouTube = false;
  let youtubeThumb = null;
  if (actualUrl.includes('youtube.com') || actualUrl.includes('youtu.be')) {
    isYouTube = true;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = actualUrl.match(regExp);
    if (match && match[2].length === 11) {
      youtubeThumb = `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
  }

  useEffect(() => {
    if (youtubeThumb) return;

    const meta = getLinkMeta(actualUrl, customText);
    if (meta.isKnownExternal) {
      setFailed(true);
      return;
    }

    const timer = setTimeout(() => {
      if (!loaded) {
        setFailed(true);
      }
    }, 2000); 

    return () => clearTimeout(timer);
  }, [actualUrl, loaded, youtubeThumb]);

  const meta = getLinkMeta(actualUrl, customText);
  const Icon = meta.icon;
  const displayLabel = meta.label;

  const imgSrc = youtubeThumb || actualUrl;

  return (
    <div className="aspect-[4/3] border-brutal overflow-hidden relative bg-gray-100 dark:bg-gray-800">
      {(!failed || youtubeThumb) && (
        <a href={actualUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group">
          <img 
            src={imgSrc} 
            alt={`${title} gallery ${index+1}`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform absolute inset-0 z-10" 
            onLoad={() => setLoaded(true)}
            onError={() => { if (!youtubeThumb) setFailed(true); }}
          />
          {isYouTube && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <FaYoutube className="text-white w-12 h-12 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md" />
            </div>
          )}
          {customText && (
            <div className="absolute bottom-2 right-2 z-20 bg-black text-white px-2 py-1 text-[10px] font-mono uppercase font-bold border border-white/20 shadow-[2px_2px_0px_#000]">
              {customText}
            </div>
          )}
        </a>
      )}
      
      {(failed && !youtubeThumb) && (
        <div className={`w-full h-full flex-col items-center justify-center bg-[var(--color-paper-cream)] p-4 text-center border-brutal border-t-0 border-l-0 border-r-0 border-b-0 h-full relative z-0 ${failed ? 'flex' : 'hidden'}`}>
          <div className={`p-4 rounded-full mb-3 border-2 border-black ${meta.color} ${meta.text} shadow-[2px_2px_0px_#000]`}>
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold uppercase text-black text-sm mb-3 line-clamp-1">{displayLabel}</h3>
          <a href={actualUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_var(--color-sticker-pink)]">
            Open Link <FiExternalLink />
          </a>
        </div>
      )}
    </div>
  );
}
