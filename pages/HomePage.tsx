
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { NAV_LINKS } from '../constants';
import { useEditMode } from '../components/EditModeContext';
import { Article, Row, RowLayout } from '../types';
import { generateId } from '../utils/idUtils';

const initialArticlesData: Record<string, Article> = {
  'home-welcome': {
    id: 'home-welcome',
    title: "Welkom bij de hardloop kennisbank voor trainers!",
    content: "Uw centrale bron voor informatie over hardlooptraining. Of u nu een beginnend hardlooptrainer bent, of een coach die zijn kennis wil verdiepen, hier vindt u waardevolle inzichten en praktische tips.\nNavigeer door de verschillende secties om meer te leren over trainingsleer, effectieve trainingsmethoden, optimale looptechniek, en de kunst van het training geven.",
    collapsible: true, 
    initiallyExpanded: true,
    titleClassName: "bg-transparent text-white !pb-2", 
    contentClassName: "!text-sky-50", 
  },
  'home-discover': {
    id: 'home-discover',
    title: "Ontdek onze Kennisbank",
    // Content is now dynamically generated as Link buttons
    content: "", 
    collapsible: false,
    initiallyExpanded: true,
  },
  'home-why': {
    id: 'home-why',
    title: "Waarom deze Kennisbank?",
    content: "Hardlopen is meer dan alleen de ene voet voor de andere zetten. Het vereist kennis van je lichaam, de juiste trainingsprincipes en een goede techniek om prestaties te verbeteren en blessures te voorkomen.\nDeze kennisbank is ontworpen om complexe onderwerpen toegankelijk te maken en u te helpen uw loopdoelen te bereiken.",
    collapsible: false,
    initiallyExpanded: true,
    imageUrl: "https://picsum.photos/seed/runningknowledge/600/300"
  },
  'home-start': {
    id: 'home-start',
    title: "Begin vandaag nog!",
    content: "Kies een onderwerp uit de navigatiebalk hierboven of selecteer een van de snelle links om uw reis naar betere hardloopprestaties en -kennis te starten. Veel loopplezier!",
    collapsible: false,
    initiallyExpanded: true,
  }
};

const initialRowsData: Row[] = [
  { id: generateId(), layout: 'single', articleIds: ['home-welcome'], className: "bg-gradient-to-r from-sky-600 to-sky-500" },
  { id: generateId(), layout: 'double', articleIds: ['home-discover', 'home-why'] },
  { id: generateId(), layout: 'single', articleIds: ['home-start'] },
];


const HomePage: React.FC = () => {
  const { isEditing } = useEditMode();
  const [articles, setArticles] = useState<Record<string, Article>>(initialArticlesData);
  const [rows, setRows] = useState<Row[]>(initialRowsData);

  const handleUpdateArticle = (articleId: string, updates: Partial<Article>) => {
    setArticles(prev => ({ ...prev, [articleId]: { ...prev[articleId], ...updates } }));
  };

  const handleDeleteArticle = (articleIdToDelete: string, rowId: string, currentLayout: RowLayout) => {
    setArticles(prevArticles => {
      const newArticles = { ...prevArticles };
      delete newArticles[articleIdToDelete];
      return newArticles;
    });

    setRows(prevRows => prevRows.map(row => {
      if (row.id === rowId) {
        const updatedArticleIds = row.articleIds.filter(id => id !== articleIdToDelete);
        if (updatedArticleIds.length === 0) {
          return null; 
        }
        return { ...row, articleIds: updatedArticleIds, layout: updatedArticleIds.length === 1 ? 'single' : row.layout };
      }
      return row;
    }).filter(row => row !== null) as Row[]);
  };

  const handleAddRow = (layout: RowLayout) => {
    const newRowId = generateId();
    let newArticleIds: string[] = [];
    const newArticlesToAdd: Record<string, Article> = {};

    if (layout === 'single') {
      const newArticleId = generateId();
      newArticleIds = [newArticleId];
      newArticlesToAdd[newArticleId] = { id: newArticleId, title: 'Nieuw artikel', content: 'Begin hier met schrijven...', collapsible: true, initiallyExpanded: true, imageUrl: '' };
    } else { 
      const newArticleId1 = generateId();
      const newArticleId2 = generateId();
      newArticleIds = [newArticleId1, newArticleId2];
      newArticlesToAdd[newArticleId1] = { id: newArticleId1, title: 'Nieuw artikel 1', content: 'Inhoud voor artikel 1...', collapsible: true, initiallyExpanded: true, imageUrl: '' };
      newArticlesToAdd[newArticleId2] = { id: newArticleId2, title: 'Nieuw artikel 2', content: 'Inhoud voor artikel 2...', collapsible: true, initiallyExpanded: true, imageUrl: '' };
    }
    
    setArticles(prev => ({ ...prev, ...newArticlesToAdd }));
    setRows(prev => [...prev, { id: newRowId, layout, articleIds: newArticleIds }]);
  };

  const handleMoveRow = (rowId: string, direction: 'up' | 'down') => {
    setRows(prevRows => {
      const index = prevRows.findIndex(row => row.id === rowId);
      if (index === -1) return prevRows;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prevRows.length) return prevRows;

      const newRows = [...prevRows];
      const temp = newRows[index];
      newRows[index] = newRows[newIndex];
      newRows[newIndex] = temp;
      return newRows;
    });
  };
  
  const handleChangeArticleLayout = (articleId: string, rowId: string, currentLayout: RowLayout) => {
    setRows(prevRows => {
        const newRows = [...prevRows];
        const rowIndex = newRows.findIndex(r => r.id === rowId);
        if (rowIndex === -1) return prevRows;

        const currentRow = newRows[rowIndex];

        if (currentLayout === 'single' && currentRow.articleIds.includes(articleId)) {
            const newPlaceholderArticleId = generateId();
            setArticles(prevArticles => ({
                ...prevArticles,
                [newPlaceholderArticleId]: { id: newPlaceholderArticleId, title: 'Nieuw artikel (rechterkant)', content: 'Voeg hier content toe.', collapsible: true, initiallyExpanded: true, imageUrl: '' }
            }));
            newRows[rowIndex] = { ...currentRow, layout: 'double', articleIds: [...currentRow.articleIds, newPlaceholderArticleId] };
        } else if (currentLayout === 'double' && currentRow.articleIds.includes(articleId)) {
            const otherArticleId = currentRow.articleIds.find(id => id !== articleId);
            newRows[rowIndex] = { ...currentRow, layout: 'single', articleIds: [articleId] };

            if (otherArticleId && articles[otherArticleId]) {
                const newRowForOtherArticle: Row = { id: generateId(), layout: 'single', articleIds: [otherArticleId] };
                newRows.splice(rowIndex + 1, 0, newRowForOtherArticle);
            }
        }
        return newRows.filter(row => row.articleIds.length > 0); 
    });
  };

  const renderDiscoverLinks = () => {
    const pageLinks = NAV_LINKS.filter(link => link.path !== "/"); // Exclude Home link
    return (
      <div className="space-y-2">
        {pageLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className="block w-full text-left bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
          >
            {link.label}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {isEditing && (
        <div className="mb-6 p-4 bg-sky-100 rounded-lg shadow flex gap-4 justify-center">
          <button
            onClick={() => handleAddRow('single')}
            className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
          >
            Nieuwe sectie (volledig)
          </button>
          <button
            onClick={() => handleAddRow('double')}
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          >
            Nieuwe sectie (2 kolommen)
          </button>
        </div>
      )}

      {rows.map((row, rowIndex) => (
        <div 
            key={row.id} 
            className={`${
              row.layout === 'double' ? 'grid md:grid-cols-2 gap-8' : 'space-y-8'
            } ${row.className ? `${row.className} rounded-lg` : ''}`}
        >
          {row.articleIds.map(articleId => {
            const article = articles[articleId];
            if (!article) return null;
            
            // Special rendering for home-discover article
            if (article.id === 'home-discover' && !isEditing) {
              return (
                 <Card
                  key={article.id}
                  article={article}
                  isEditing={isEditing}
                  onUpdateArticle={handleUpdateArticle}
                  onDeleteArticle={handleDeleteArticle}
                  onChangeArticleLayout={handleChangeArticleLayout}
                  onMoveRowUp={rowIndex > 0 ? () => handleMoveRow(row.id, 'up') : undefined}
                  onMoveRowDown={rowIndex < rows.length - 1 ? () => handleMoveRow(row.id, 'down') : undefined}
                  rowId={row.id}
                  currentLayout={row.layout}
                  className={row.articleIds.length === 1 && row.className ? row.className : ''}
                  titleClassName={article.titleClassName}
                  contentClassName={article.contentClassName}
                >
                  {renderDiscoverLinks()}
                </Card>
              );
            }

            return (
              <Card
                key={article.id}
                article={article}
                isEditing={isEditing}
                onUpdateArticle={handleUpdateArticle}
                onDeleteArticle={handleDeleteArticle}
                onChangeArticleLayout={handleChangeArticleLayout}
                onMoveRowUp={rowIndex > 0 ? () => handleMoveRow(row.id, 'up') : undefined}
                onMoveRowDown={rowIndex < rows.length - 1 ? () => handleMoveRow(row.id, 'down') : undefined}
                rowId={row.id}
                currentLayout={row.layout}
                className={row.articleIds.length === 1 && row.className ? row.className : ''} 
                titleClassName={article.titleClassName}
                contentClassName={article.contentClassName}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default HomePage;
