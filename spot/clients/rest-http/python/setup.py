from setuptools import setup, find_packages

setup(
    name="zebpay-spot-client",
    version="1.0.0",
    description="Python client for Zebpay Spot Trading API",
    author="Zebpay",
    author_email="support@zebpay.com",
    url="https://github.com/zebpay/api-references",
    packages=find_packages(),
    install_requires=[
        "requests>=2.25.1",
        "typing-extensions>=3.7.4"
    ],
    python_requires=">=3.7",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
) 