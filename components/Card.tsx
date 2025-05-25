import React, { useState, useId, ChangeEvent } from 'react';
import { Article, RowLayout } from '../types'; // Assuming types.ts is in src or a level up
import ChevronIcon from './ChevronIcon';
import { renderArticleContentFromString } from '../utils/contentParser';

export interface CardProps {
  article: Article;
  isEditing?: boolean;
  onUpdateArticle?: (articleId: string, updates: Partial<Article>) => void;
  onDeleteArticle?: (articleId: string, rowId: string, layout: RowLayout) => void;
  onChangeArticleLayout?: (articleId: string, rowId: string, currentLayout: RowLayout) => void;
  onMoveRowUp?: (rowId: string) => void;
  onMoveRowDown?: (rowId: string) => void;
  rowId?: string; 
  currentLayout?: RowLayout;
  className?: string;
  children?: React.ReactNode;
  titleClassName?: string;
  contentClassName?: string;
}

const Card: React.FC<CardProps> = ({
  article,
  isEditing = false,
  onUpdateArticle = () => {},
  onDeleteArticle = () => {},
  onChangeArticleLayout = () => {},
  onMoveRowUp,
  onMoveRowDown,
  rowId = '', 
  currentLayout = 'single', 
  className,
  children, 
  titleClassName, 
  contentClassName, 
}) => {
  const contentId = useId();
  const [isExpanded, setIsExpanded] = useState(article.initiallyExpanded ?? true);

  const handleToggleExpand = () => {
    if (!isEditing) { 
      setIsExpanded(!isExpanded);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Article
  ) => {
    if (onUpdateArticle) {
      onUpdateArticle(article.id, { [field]: e.target.value });
    }
  };

  const headerBaseClasses = "p-4 md:p-6 flex justify-between items-center w-full text-left";
  const headerDefaultStyling = "bg-sky-600 text-white";
  const effectiveHeaderStyling = titleClassName !== undefined ? titleClassName : (article.titleClassName || headerDefaultStyling);
  const isEffectivelyCollapsible = article.collapsible ?? !!article.title;


  return (
    <div className={`bg-white shadow-xl rounded-lg overflow-hidden flex flex-col h-full ${className || ''}`}>
      {article.title && (
        <div
          className={`${headerBaseClasses} ${effectiveHeaderStyling} ${isEffectivelyCollapsible && !isEditing ? 'cursor-pointer hover:opacity-90' : ''} ${isEditing ? '!bg-slate-200' : ''}`}
          onClick={isEffectivelyCollapsible && !isEditing ? handleToggleExpand : undefined}
          aria-expanded={isEffectivelyCollapsible && !isEditing ? isExpanded : undefined}
          aria-controls={isEffectivelyCollapsible && !isEditing ? contentId : undefined}
          role={isEffectivelyCollapsible && !isEditing ? "button" : undefined}
          tabIndex={isEffectivelyCollapsible && !isEditing ? 0 : undefined}
          onKeyDown={isEffectivelyCollapsible && !isEditing ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleToggleExpand(); } : undefined}
        >
          {isEditing ? (
            <input
              type="text"
              value={article.title || ''}
              onChange={(e) => handleInputChange(e, 'title')}
              className="text-2xl font-heading font-semibold bg-white text-slate-800 border-b border-sky-500 focus:ring-sky-500 focus:border-sky-500 w-full py-1 shadow-sm"
              placeholder="Titel van het artikel"
            />
          ) : (
            <h2 className="text-2xl font-heading font-semibold">{article.title}</h2>
          )}
          {isEffectivelyCollapsible && !isEditing && <ChevronIcon isExpanded={isExpanded} />}
        </div>
      )}

      {isEditing && (
        <div className="p-4 space-y-2 bg-slate-100 border-b border-slate-300">
            <div className="flex flex-wrap gap-2 text-xs">
                 <button 
                    onClick={() => onDeleteArticle(article.id, rowId, currentLayout)}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                    aria-label={`Verwijder artikel ${article.title || 'zonder titel'}`}
                  >
                    Verwijder artikel
                  </button>
                  <button 
                    onClick={() => onChangeArticleLayout(article.id, rowId, currentLayout)}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                    aria-label={`Verander layout voor artikel ${article.title || 'zonder titel'}`}
                  >
                    Verander layout ({currentLayout === 'single' ? 'naar 2 koloms' : 'naar volledig'})
                  </button>
                  {onMoveRowUp && rowId && <button onClick={() => onMoveRowUp(rowId)} className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded" aria-label="Verplaats rij omhoog">↑ Rij omhoog</button>}
                  {onMoveRowDown && rowId && <button onClick={() => onMoveRowDown(rowId)} className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded" aria-label="Verplaats rij omlaag">↓ Rij omlaag</button>}
            </div>
             <div>
                <label htmlFor={`imageUrl-${article.id}`} className="block text-sm font-medium text-slate-700">Afbeeldings-URL:</label>
                <input
                    id={`imageUrl-${article.id}`}
                    type="text"
                    value={article.imageUrl || ''}
                    onChange={(e) => handleInputChange(e, 'imageUrl')}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    placeholder="https://example.com/image.jpg"
                />
            </div>
        </div>
      )}

      {(!isEffectivelyCollapsible || isExpanded || isEditing) && (
        <div
          id={contentId}
          className={`p-4 md:p-6 text-lg text-slate-800 space-y-4 flex-grow ${contentClassName !== undefined ? contentClassName : (article.contentClassName || '')}`}
        >
          {isEditing ? (
            <textarea
              value={article.content}
              onChange={(e) => handleInputChange(e, 'content')}
              className="w-full h-48 p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-base text-slate-800 bg-white"
              placeholder="Inhoud van het artikel..."
              aria-label={`Inhoud voor artikel ${article.title || 'zonder titel'}`}
            />
          ) : (
            <>
              {article.imageUrl && <img src={article.imageUrl} alt={article.title || 'Artikelafbeelding'} className="mb-4 rounded-lg shadow-md w-full object-cover h-auto max-h-64"/>}
              {children ? children : renderArticleContentFromString(article.content)}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;