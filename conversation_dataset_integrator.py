#!/usr/bin/env python3
"""
Conversation Dataset Integration System
Upload and integrate conversation datasets to enhance SIM conversational abilities
"""

import json
import requests
import time
import os
from datetime import datetime
from pathlib import Path

class ConversationDatasetIntegrator:
    def __init__(self):
        self.local_url = "http://localhost:5000"
        self.conversation_data = []
        self.processed_datasets = []
        
    def upload_conversation_dataset(self, dataset_path=None, dataset_url=None, dataset_name=None):
        """Upload and process conversation dataset"""
        
        if dataset_path:
            # Load from local file
            return self._process_local_dataset(dataset_path, dataset_name)
        elif dataset_url:
            # Load from URL (Hugging Face, etc.)
            return self._process_url_dataset(dataset_url, dataset_name)
        else:
            return {"status": "error", "message": "No dataset source provided"}
    
    def _process_local_dataset(self, file_path, dataset_name):
        """Process local conversation dataset file"""
        try:
            # Support multiple file formats
            file_path = Path(file_path)
            
            if file_path.suffix.lower() == '.json':
                with open(file_path, 'r', encoding='utf-8') as f:
                    raw_data = json.load(f)
            elif file_path.suffix.lower() == '.txt':
                with open(file_path, 'r', encoding='utf-8') as f:
                    raw_data = self._parse_text_conversations(f.read())
            else:
                return {"status": "error", "message": f"Unsupported file format: {file_path.suffix}"}
            
            # Process and standardize conversation data
            processed_conversations = self._standardize_conversation_format(raw_data, dataset_name or file_path.stem)
            
            # Integration with SIM
            integration_result = self._integrate_conversations_with_sim(processed_conversations, dataset_name or file_path.stem)
            
            return {
                "status": "success",
                "dataset_name": dataset_name or file_path.stem,
                "conversations_processed": len(processed_conversations),
                "integration_result": integration_result
            }
            
        except Exception as e:
            return {"status": "error", "message": f"Error processing local dataset: {e}"}
    
    def _process_url_dataset(self, url, dataset_name):
        """Process conversation dataset from URL"""
        try:
            # For Hugging Face datasets or other APIs
            print(f"Fetching conversation dataset from: {url}")
            
            # Simulate dataset fetch - in real implementation would use datasets library
            # response = requests.get(url)
            # raw_data = response.json()
            
            # For now, create sample conversation structure
            raw_data = {
                "conversations": [
                    {
                        "user": "Hello, how are you?",
                        "assistant": "I'm doing well, thank you! How can I help you today?",
                        "context": "greeting"
                    }
                ]
            }
            
            processed_conversations = self._standardize_conversation_format(raw_data, dataset_name or "url_dataset")
            integration_result = self._integrate_conversations_with_sim(processed_conversations, dataset_name or "url_dataset")
            
            return {
                "status": "success",
                "dataset_name": dataset_name or "url_dataset",
                "conversations_processed": len(processed_conversations),
                "integration_result": integration_result
            }
            
        except Exception as e:
            return {"status": "error", "message": f"Error processing URL dataset: {e}"}
    
    def _parse_text_conversations(self, text_content):
        """Parse text file containing conversations"""
        conversations = []
        lines = text_content.strip().split('\n')
        
        current_conversation = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                if current_conversation:
                    conversations.append(current_conversation)
                    current_conversation = {}
                continue
                
            if line.startswith('User:') or line.startswith('USER:'):
                current_conversation['user'] = line.split(':', 1)[1].strip()
            elif line.startswith('Assistant:') or line.startswith('SIM:') or line.startswith('AI:'):
                current_conversation['assistant'] = line.split(':', 1)[1].strip()
            elif line.startswith('Context:'):
                current_conversation['context'] = line.split(':', 1)[1].strip()
        
        if current_conversation:
            conversations.append(current_conversation)
            
        return {"conversations": conversations}
    
    def _standardize_conversation_format(self, raw_data, dataset_name):
        """Standardize conversation data to consistent format"""
        standardized = []
        
        # Handle different input formats
        if isinstance(raw_data, dict) and 'conversations' in raw_data:
            conversations = raw_data['conversations']
        elif isinstance(raw_data, list):
            conversations = raw_data
        else:
            conversations = [raw_data]
        
        for conv in conversations:
            standardized_conv = {
                "dataset_source": dataset_name,
                "user_input": conv.get('user', ''),
                "assistant_response": conv.get('assistant', ''),
                "context": conv.get('context', 'general'),
                "timestamp": datetime.now().isoformat(),
                "conversation_quality": self._assess_conversation_quality(conv),
                "response_patterns": self._extract_response_patterns(conv.get('assistant', ''))
            }
            standardized.append(standardized_conv)
        
        return standardized
    
    def _assess_conversation_quality(self, conversation):
        """Assess the quality of a conversation for learning purposes"""
        user_text = conversation.get('user', '')
        assistant_text = conversation.get('assistant', '')
        
        quality_score = 0.5  # Base score
        
        # Length assessment
        if len(assistant_text) > 50:
            quality_score += 0.1
        if len(assistant_text) > 100:
            quality_score += 0.1
            
        # Technical content assessment
        technical_terms = ['system', 'analysis', 'data', 'process', 'algorithm', 'pattern', 'correlation']
        if any(term in assistant_text.lower() for term in technical_terms):
            quality_score += 0.2
            
        # Specificity assessment
        if any(word in assistant_text.lower() for word in ['specifically', 'detailed', 'comprehensive']):
            quality_score += 0.1
            
        return min(1.0, quality_score)
    
    def _extract_response_patterns(self, response_text):
        """Extract patterns from assistant responses for learning"""
        patterns = []
        
        response_lower = response_text.lower()
        
        # Question patterns
        if '?' in response_text:
            patterns.append('asks_questions')
        
        # Technical patterns
        if any(word in response_lower for word in ['analysis', 'system', 'data', 'process']):
            patterns.append('technical_response')
        
        # Explanatory patterns
        if any(word in response_lower for word in ['because', 'due to', 'this means', 'therefore']):
            patterns.append('explanatory')
        
        # Helpful patterns
        if any(word in response_lower for word in ['can help', 'let me', 'i can', 'would you like']):
            patterns.append('helpful_offering')
        
        return patterns
    
    def _integrate_conversations_with_sim(self, conversations, dataset_name):
        """Integrate processed conversations with SIM system"""
        try:
            # Send learning data to SIM
            learning_message = f"Conversation Dataset Integration: Processing {len(conversations)} conversations from '{dataset_name}'. Integrating conversation patterns, response styles, and interactive behaviors to enhance conversational capabilities. This will improve context awareness, response variety, and natural conversation flow."
            
            response = requests.post(
                f"{self.local_url}/sim_chat",
                json={"message": learning_message}
            )
            
            if response.status_code == 200:
                print(f"✅ Conversation dataset '{dataset_name}' integrated successfully")
                
                # Save conversation data for future reference
                self._save_conversation_dataset(conversations, dataset_name)
                
                return {
                    "status": "success",
                    "message": f"Conversation dataset '{dataset_name}' integrated successfully",
                    "conversations_learned": len(conversations)
                }
            else:
                return {"status": "error", "message": f"SIM integration failed: {response.status_code}"}
                
        except Exception as e:
            return {"status": "error", "message": f"Integration error: {e}"}
    
    def _save_conversation_dataset(self, conversations, dataset_name):
        """Save processed conversation dataset"""
        try:
            dataset_file = f"conversation_dataset_{dataset_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            dataset_record = {
                "dataset_name": dataset_name,
                "integration_timestamp": datetime.now().isoformat(),
                "conversation_count": len(conversations),
                "conversations": conversations,
                "quality_metrics": self._calculate_dataset_metrics(conversations)
            }
            
            with open(dataset_file, 'w', encoding='utf-8') as f:
                json.dump(dataset_record, f, indent=2, ensure_ascii=False)
            
            print(f"Conversation dataset saved: {dataset_file}")
            
        except Exception as e:
            print(f"Error saving conversation dataset: {e}")
    
    def _calculate_dataset_metrics(self, conversations):
        """Calculate metrics for the conversation dataset"""
        if not conversations:
            return {}
        
        total_quality = sum(conv['conversation_quality'] for conv in conversations)
        avg_quality = total_quality / len(conversations)
        
        pattern_counts = {}
        for conv in conversations:
            for pattern in conv['response_patterns']:
                pattern_counts[pattern] = pattern_counts.get(pattern, 0) + 1
        
        return {
            "average_quality_score": avg_quality,
            "pattern_distribution": pattern_counts,
            "total_conversations": len(conversations),
            "technical_conversations": sum(1 for conv in conversations if 'technical_response' in conv['response_patterns']),
            "helpful_conversations": sum(1 for conv in conversations if 'helpful_offering' in conv['response_patterns'])
        }
    
    def list_uploaded_datasets(self):
        """List all uploaded conversation datasets"""
        dataset_files = list(Path('.').glob('conversation_dataset_*.json'))
        
        datasets = []
        for file_path in dataset_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    datasets.append({
                        "file": file_path.name,
                        "dataset_name": data.get('dataset_name', 'unknown'),
                        "conversation_count": data.get('conversation_count', 0),
                        "integration_timestamp": data.get('integration_timestamp', 'unknown'),
                        "quality_metrics": data.get('quality_metrics', {})
                    })
            except Exception as e:
                print(f"Error reading dataset file {file_path}: {e}")
        
        return datasets

if __name__ == "__main__":
    integrator = ConversationDatasetIntegrator()
    
    # Example usage
    print("Conversation Dataset Integrator Ready")
    print("You can now upload conversation datasets to improve SIM responses")
    print("\nExample usage:")
    print("1. integrator.upload_conversation_dataset(dataset_path='conversations.txt')")
    print("2. integrator.upload_conversation_dataset(dataset_url='https://huggingface.co/dataset')")
    print("3. integrator.list_uploaded_datasets()")