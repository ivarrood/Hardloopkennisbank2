
import React, { useState } from 'react';
import Card from '../components/Card';
import { useEditMode } from '../components/EditModeContext';
import { Article, Row, RowLayout } from '../types';
import { generateId } from '../utils/idUtils';

const initialArticlesData: Record<string, Article> = {
  'lt-waarom': {
    id: 'lt-waarom',
    title: "Waarom is een goede looptechniek belangrijk?",
    content: "Een efficiënte looptechniek zorgt ervoor dat je met minder energie sneller kunt lopen en vermindert de kans op overbelastingsblessures. Hoewel er niet één \"perfecte\" loopstijl is, zijn er algemene principes die de meeste lopers ten goede komen.",
    collapsible: true,
    initiallyExpanded: true,
    imageUrl: "https://picsum.photos/seed/technique/600/300"
  },
  'lt-houding': {
    id: 'lt-houding',
    title: "Houding (Posture)",
    content: "Loop rechtop met een lichte voorwaartse helling vanuit de enkels (niet vanuit de heupen). Houd je hoofd omhoog, kin parallel aan de grond, en kijk vooruit. Ontspan je schouders.",
    collapsible: true,
    initiallyExpanded: true,
  },
  'lt-voetlanding': {
    id: 'lt-voetlanding',
    title: "Voetlanding (Foot Strike)",
    content: "Probeer te landen op je middenvoet of voorvoet, onder je zwaartepunt. Dit helpt overstriding (te ver voor je lichaam landen) te voorkomen, wat remmend werkt en de impact verhoogt. Vermijd een zware haklanding.",
    collapsible: true,
    initiallyExpanded: true,
  },
  'lt-cadans': {
    id: 'lt-cadans',
    title: "Cadans (Cadence)",
    content: "Cadans is het aantal stappen per minuut. Een hogere cadans (rond de 170-180+ stappen per minuut voor veel lopers) kan helpen de impact te verminderen en de efficiëntie te verbeteren. Dit betekent vaak kortere, snellere passen.",
    collapsible: true,
    initiallyExpanded: true,
  },
   'lt-armbeweging': {
    id: 'lt-armbeweging',
    title: "Armbeweging (Arm Swing)",
    content: "Buig je armen in een hoek van ongeveer 90 graden. Zwaai ze ontspannen voor- en achterwaarts vanuit de schouders, niet vanuit de ellebogen. Je handen mogen niet voorbij de middellijn van je lichaam komen.",
    collapsible: true,
    initiallyExpanded: true,
  },
  'lt-heupen': {
    id: 'lt-heupen',
    title: "Heupen (Hips)",
    content: "Houd je heupen stabiel en naar voren gericht. Vermijd overmatig zijwaarts wiegen. Een sterke core helpt bij heupstabiliteit.",
    collapsible: true,
    initiallyExpanded: true,
  },
  'lt-ademhaling': {
    id: 'lt-ademhaling',
    title: "Ademhaling (Breathing)",
    content: "Adem diep en ritmisch, bij voorkeur via zowel neus als mond. Probeer je ademhaling te synchroniseren met je pasritme, bijvoorbeeld 3 stappen inademen, 2 stappen uitademen.",
    collapsible: true,
    initiallyExpanded: true,
  },
  'lt-loopscholing': {
    id: 'lt-loopscholing',
    title: "Loopscholingsoefeningen",
    content: "Regelmatige loopscholing (drills) kan helpen om specifieke aspecten van je looptechniek te verbeteren. Voorbeelden zijn:\n*   Skippings (knieheffen)\n*   Hiel-billen (butt kicks)\n*   Triplings\n*   Pendelpas\nVoer deze oefeningen uit op een zachte ondergrond en focus op een correcte uitvoering.",
    collapsible: true,
    initiallyExpanded: true,
  }
};

// Original 3-column layout is converted to series of double/single rows
const initialRowsData: Row[] = [
  { id: generateId(), layout: 'single', articleIds: ['lt-waarom'] },
  { id: generateId(), layout: 'double', articleIds: ['lt-houding', 'lt-voetlanding'] },
  { id: generateId(), layout: 'double', articleIds: ['lt-cadans', 'lt-armbeweging'] },
  { id: generateId(), layout: 'double', articleIds: ['lt-heupen', 'lt-ademhaling'] },
  { id: generateId(), layout: 'single', articleIds: ['lt-loopscholing'] },
];

const LooptechniekPage: React.FC = () => {
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

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-heading font-semibold text-sky-700 text-center">Looptechniek</h1>
        <p className="text-xl text-slate-600 mt-2 text-center">Optimaliseer je vorm voor efficiëntie en blessurepreventie.</p>
      </header>

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
        <div key={row.id} className={row.layout === 'double' ? 'grid md:grid-cols-2 gap-8' : 'space-y-8'}>
          {row.articleIds.map(articleId => {
            const article = articles[articleId];
            if (!article) return null;
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
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default LooptechniekPage;