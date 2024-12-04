import os
import shutil
import random

def split_dataset(input_dir, output_dir, test_size=0.2, random_seed=42):
    """
    Split a dataset into training and testing sets while preserving label subfolder structure
    
    Args:
        input_dir (str): Path to the input dataset directory
        output_dir (str): Path to output training and testing directories
        test_size (float): Proportion of data to use for testing (default: 0.2)
        random_seed (int): Random seed for reproducibility (default: 42)
    """
    # Set random seed for reproducibility
    random.seed(random_seed)
    
    # Create output directories
    train_dir = os.path.join(output_dir, 'train')
    test_dir = os.path.join(output_dir, 'test')
    os.makedirs(train_dir, exist_ok=True)
    os.makedirs(test_dir, exist_ok=True)
    
    # Process each label subdirectory
    for label in os.listdir(input_dir):
        label_path = os.path.join(input_dir, label)
        
        # Skip if not a directory
        if not os.path.isdir(label_path):
            continue

        
        # Create label subdirectories in train and test
        train_label_dir = os.path.join(train_dir, label)
        test_label_dir = os.path.join(test_dir, label)
        os.makedirs(train_label_dir, exist_ok=True)
        os.makedirs(test_label_dir, exist_ok=True)
        
        # Get all image files
        image_files = [f for f in os.listdir(label_path) 
                       if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif'))]
        
        # Shuffle images
        random.shuffle(image_files)
        
        # Calculate split index
        split_idx = int(len(image_files) * (1 - test_size))
        
        # Split and copy files
        for i, image_file in enumerate(image_files):
            src_path = os.path.join(label_path, image_file)
            
            if i < split_idx:
                # Training set
                dst_path = os.path.join(train_label_dir, image_file)
            else:
                # Testing set
                dst_path = os.path.join(test_label_dir, image_file)
            
            shutil.copy2(src_path, dst_path)
    
    # Print dataset split statistics
    print("Dataset Split Complete:")
    print(f"Input Directory: {input_dir}")
    print(f"Output Directory: {output_dir}")
    
    # Count and display images in each set
    for split in ['train', 'test']:
        split_dir = os.path.join(output_dir, split)
        print(f"\n{split.capitalize()} Set:")
        for label in os.listdir(split_dir):
            label_path = os.path.join(split_dir, label)
            image_count = len([f for f in os.listdir(label_path) 
                                if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif'))])
            print(f"  {label}: {image_count} images")

def main():
    # Input directory with your labeled images
    input_directory = 'CIX_IA_TEAM/archive/TrashType_Image_Dataset'
    
    # Output directory for split dataset
    output_directory = 'archive/dataset'
    
    # Split the dataset
    split_dataset(
        input_dir=input_directory, 
        output_dir=output_directory, 
        test_size=0.2,  # 20% for testing, 80% for training
        random_seed=42  # Ensures reproducible splits
    )

if __name__ == "__main__":
    main()