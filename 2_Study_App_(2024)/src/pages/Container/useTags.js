import { useState, useEffect } from 'react';
import tagsData from '../../info/tags.json';

export const useTags = () => {
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [readLinks, setReadLinks] = useState(() => {
    const savedLinks = localStorage.getItem('readLinks');
    return savedLinks ? JSON.parse(savedLinks) : {};
  });

  useEffect(() => {
    localStorage.setItem('readLinks', JSON.stringify(readLinks));
  }, [readLinks]);

  const { tags } = tagsData;
  const links = Object.keys(tags);
  const totalLinksCount = links.length;
  const readLinksCount = Object.keys(readLinks).length;

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(selectedTag?.content);
  utterance.lang = 'ru-RU'

  function setSelectTagAndLink(tag, link) {
    synth.cancel();
    setSelectedTag(tag);
    setSelectedLink(link);
  }

  const handleLinkClick = (tag) => {
    setSelectTagAndLink(tags[tag], tag);
  };

  const handleDelClick = () => {
    setReadLinks({});
    setSelectTagAndLink(null, null);
  }

  const handleNextLinkClick = () => {
    var targetElement = document.getElementById("headerTag");
    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    if (selectedLink) {
      setReadLinks({
        ...readLinks,
        [selectedLink]: true,
      });
      const currentIndex = links.indexOf(selectedLink);
      const nextLink = links[currentIndex + 1];
      if (nextLink) {
        setSelectTagAndLink(tags[nextLink], nextLink);
      }
    }
  };

  const completionPercentage = totalLinksCount > 0 ? ((readLinksCount / totalLinksCount) * 100).toFixed(1) : 0;


  return {
    selectedTag,
    selectedLink,
    readLinks,
    links,
    totalLinksCount,
    readLinksCount,
    completionPercentage,
    synth,
    utterance,
    handleLinkClick,
    handleDelClick,
    handleNextLinkClick,
  };
};
